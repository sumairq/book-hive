'use client';

import { create } from 'zustand';

import type { PublicUser } from '@/types';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

type AuthState = {
  user: PublicUser | null;
  status: AuthStatus;
  setUser: (user: PublicUser | null) => void;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
};

async function jsonOrNull<T>(res: Response): Promise<T | null> {
  try {
    const body = await res.json();
    if (body?.ok && body?.data) return body.data as T;
  } catch {
    /* ignore */
  }
  return null;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',

  setUser: (user) => set({ user, status: user ? 'authenticated' : 'unauthenticated' }),

  hydrate: async () => {
    set({ status: 'loading' });
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (res.ok) {
      const data = await jsonOrNull<{ user: PublicUser }>(res);
      set({ user: data?.user ?? null, status: data?.user ? 'authenticated' : 'unauthenticated' });
    } else {
      set({ user: null, status: 'unauthenticated' });
    }
  },

  logout: async () => {
    const csrf =
      typeof document !== 'undefined'
        ? document.cookie
            .split('; ')
            .find((c) => c.startsWith('bh_csrf='))
            ?.split('=')[1]
        : undefined;
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: csrf ? { 'x-csrf-token': decodeURIComponent(csrf) } : undefined,
    });
    set({ user: null, status: 'unauthenticated' });
  },
}));
