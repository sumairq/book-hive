import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

import { ACCESS_COOKIE } from '@/lib/auth/cookie-names';

const PROTECTED_PREFIXES = ['/dashboard', '/feed', '/profile', '/settings', '/books', '/notes'];
const AUTH_PAGES = ['/login', '/register'];

const accessSecret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET ?? '');

async function isAuthenticated(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, accessSecret, { issuer: 'book-hive', audience: 'book-hive-app' });
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  const authed = await isAuthenticated(token);

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const isAuthPage = AUTH_PAGES.includes(pathname);

  if (isProtected && !authed) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && authed) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled by route guards)
     * - _next static / image
     * - favicon
     * - public assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
