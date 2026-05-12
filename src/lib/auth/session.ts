import 'server-only';

import { connectDB } from '@/lib/db/connect';
import { User, type UserDoc, type UserRole } from '@/models';
import { getAccessToken } from './cookies';
import { verifyAccessToken } from './jwt';

export type Session = {
  userId: string;
  username: string;
  role: UserRole;
};

export async function getSession(): Promise<Session | null> {
  const token = await getAccessToken();
  if (!token) return null;
  try {
    const claims = await verifyAccessToken(token);
    return {
      userId: claims.sub,
      username: claims.username,
      role: claims.role,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserDoc | null> {
  const session = await getSession();
  if (!session) return null;
  await connectDB();
  return User.findById(session.userId).lean<UserDoc>();
}
