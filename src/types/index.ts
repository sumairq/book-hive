import type { UserRole } from '@/models';

export type PublicUser = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  bio: string;
  avatarUrl: string | null;
  followersCount: number;
  followingCount: number;
  createdAt: string;
};
