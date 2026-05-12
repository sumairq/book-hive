import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { randomUUID } from 'node:crypto';

import { env } from '@/lib/env';
import type { UserRole } from '@/models';

export type AccessTokenClaims = JWTPayload & {
  sub: string;
  username: string;
  role: UserRole;
};

export type RefreshTokenClaims = JWTPayload & {
  sub: string;
  jti: string;
};

const accessSecret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
const refreshSecret = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

const ISSUER = 'book-hive';
const AUDIENCE = 'book-hive-app';

export async function signAccessToken(claims: {
  userId: string;
  username: string;
  role: UserRole;
}): Promise<string> {
  return new SignJWT({ username: claims.username, role: claims.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(claims.userId)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(env.JWT_ACCESS_TTL)
    .sign(accessSecret);
}

export async function signRefreshToken(claims: {
  userId: string;
  jti?: string;
}): Promise<{ token: string; jti: string }> {
  const jti = claims.jti ?? randomUUID();
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(claims.userId)
    .setJti(jti)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(env.JWT_REFRESH_TTL)
    .sign(refreshSecret);
  return { token, jti };
}

export async function verifyAccessToken(token: string): Promise<AccessTokenClaims> {
  const { payload } = await jwtVerify(token, accessSecret, {
    issuer: ISSUER,
    audience: AUDIENCE,
  });
  return payload as AccessTokenClaims;
}

export async function verifyRefreshToken(token: string): Promise<RefreshTokenClaims> {
  const { payload } = await jwtVerify(token, refreshSecret, {
    issuer: ISSUER,
    audience: AUDIENCE,
  });
  if (!payload.jti) {
    throw new Error('Refresh token missing jti claim');
  }
  return payload as RefreshTokenClaims;
}
