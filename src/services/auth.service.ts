import 'server-only';

import { ApiError } from '@/lib/api/errors';
import { comparePassword, hashPassword } from '@/lib/auth/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/lib/auth/jwt';
import { connectDB } from '@/lib/db/connect';
import { RefreshToken, User, type UserDoc } from '@/models';
import type { PublicUser } from '@/types';
import type { LoginInput, RegisterInput } from '@/schemas/auth.schema';

export function toPublicUser(user: UserDoc): PublicUser {
  return {
    id: String(user._id),
    email: user.email,
    username: user.username,
    role: user.role,
    bio: user.bio ?? '',
    avatarUrl: user.avatarUrl ?? null,
    followersCount: user.followersCount ?? 0,
    followingCount: user.followingCount ?? 0,
    createdAt:
      'createdAt' in user && user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : new Date().toISOString(),
  };
}

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  user: PublicUser;
};

async function issueTokens(user: UserDoc, meta?: { ip?: string; userAgent?: string }) {
  const accessToken = await signAccessToken({
    userId: String(user._id),
    username: user.username,
    role: user.role,
  });
  const { token: refreshToken, jti } = await signRefreshToken({ userId: String(user._id) });

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await RefreshToken.create({
    jti,
    userId: user._id,
    expiresAt,
    ip: meta?.ip ?? null,
    userAgent: meta?.userAgent ?? null,
  });

  return { accessToken, refreshToken, user: toPublicUser(user) } satisfies TokenPair;
}

export async function registerUser(
  input: RegisterInput,
  meta?: { ip?: string; userAgent?: string },
): Promise<TokenPair> {
  await connectDB();

  const existing = await User.findOne({
    $or: [{ email: input.email }, { username: input.username }],
  })
    .select('_id email username')
    .lean();

  if (existing) {
    const conflict = existing.email === input.email ? 'email' : 'username';
    throw new ApiError('CONFLICT', `That ${conflict} is already in use`, 409, { field: conflict });
  }

  const passwordHash = await hashPassword(input.password);
  const created = await User.create({
    email: input.email,
    username: input.username,
    passwordHash,
    role: 'user',
    lastLoginAt: new Date(),
  });

  return issueTokens(created.toObject() as UserDoc, meta);
}

export async function loginUser(
  input: LoginInput,
  meta?: { ip?: string; userAgent?: string },
): Promise<TokenPair> {
  await connectDB();

  const lookup = input.identifier.includes('@')
    ? { email: input.identifier.toLowerCase() }
    : { username: input.identifier };

  const user = await User.findOne(lookup).select('+passwordHash');
  if (!user) {
    throw new ApiError('INVALID_CREDENTIALS', 'Incorrect email/username or password', 401);
  }
  if (user.suspended) {
    throw new ApiError('ACCOUNT_SUSPENDED', 'This account has been suspended', 403);
  }
  const ok = await comparePassword(input.password, user.passwordHash);
  if (!ok) {
    throw new ApiError('INVALID_CREDENTIALS', 'Incorrect email/username or password', 401);
  }

  user.lastLoginAt = new Date();
  await user.save();

  return issueTokens(user.toObject() as UserDoc, meta);
}

export async function rotateRefresh(
  refreshToken: string,
  meta?: { ip?: string; userAgent?: string },
): Promise<TokenPair> {
  await connectDB();

  let claims;
  try {
    claims = await verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError('INVALID_TOKEN', 'Invalid refresh token', 401);
  }

  const stored = await RefreshToken.findOne({ jti: claims.jti });
  if (!stored || stored.revokedAt) {
    throw new ApiError('INVALID_TOKEN', 'Refresh token has been revoked', 401);
  }
  if (stored.expiresAt.getTime() < Date.now()) {
    throw new ApiError('INVALID_TOKEN', 'Refresh token has expired', 401);
  }
  if (String(stored.userId) !== claims.sub) {
    throw new ApiError('INVALID_TOKEN', 'Refresh token mismatch', 401);
  }

  const user = await User.findById(claims.sub);
  if (!user || user.suspended) {
    throw new ApiError('UNAUTHENTICATED', 'User no longer available', 401);
  }

  const tokens = await issueTokens(user.toObject() as UserDoc, meta);

  // Rotate: mark the old token revoked & link to the new one.
  stored.revokedAt = new Date();
  // The new jti is embedded in the refresh token; extract it for traceability.
  const newClaims = await verifyRefreshToken(tokens.refreshToken);
  stored.replacedByJti = newClaims.jti;
  await stored.save();

  return tokens;
}

export async function logoutUser(refreshToken: string | undefined): Promise<void> {
  if (!refreshToken) return;
  await connectDB();
  try {
    const claims = await verifyRefreshToken(refreshToken);
    await RefreshToken.updateOne(
      { jti: claims.jti, revokedAt: null },
      { $set: { revokedAt: new Date() } },
    );
  } catch {
    // best-effort: ignore invalid tokens on logout
  }
}
