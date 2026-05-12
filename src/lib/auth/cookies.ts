import 'server-only';

import { cookies } from 'next/headers';
import { randomBytes } from 'node:crypto';

import { env } from '@/lib/env';
import { ACCESS_COOKIE, CSRF_COOKIE, REFRESH_COOKIE } from './cookie-names';

export { ACCESS_COOKIE, REFRESH_COOKIE, CSRF_COOKIE };

const ACCESS_MAX_AGE = 60 * 15; // 15 minutes
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const isProd = env.NODE_ENV === 'production';

export async function setAuthCookies(accessToken: string, refreshToken: string): Promise<string> {
  const store = await cookies();

  store.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: ACCESS_MAX_AGE,
  });

  store.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: '/api/auth',
    maxAge: REFRESH_MAX_AGE,
  });

  const csrf = randomBytes(24).toString('base64url');
  store.set(CSRF_COOKIE, csrf, {
    httpOnly: false, // intentionally readable so the client can echo it back
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: REFRESH_MAX_AGE,
  });

  return csrf;
}

export async function clearAuthCookies(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete({ name: REFRESH_COOKIE, path: '/api/auth' });
  store.delete(CSRF_COOKIE);
}

export async function getAccessToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(REFRESH_COOKIE)?.value;
}

export async function getCsrfToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(CSRF_COOKIE)?.value;
}
