import 'server-only';

import type { NextRequest } from 'next/server';

import { ApiError } from '@/lib/api/errors';
import type { UserRole } from '@/models';
import { getAccessToken } from './cookies';
import { CSRF_COOKIE } from './cookie-names';
import { verifyAccessToken } from './jwt';
import type { Session } from './session';

const MUTATING_METHODS = new Set(['POST', 'PATCH', 'PUT', 'DELETE']);

export async function requireSession(request: NextRequest): Promise<Session> {
  const token = await getAccessToken();
  if (!token) {
    throw new ApiError('UNAUTHENTICATED', 'Authentication required', 401);
  }
  let claims;
  try {
    claims = await verifyAccessToken(token);
  } catch {
    throw new ApiError('INVALID_TOKEN', 'Invalid or expired access token', 401);
  }

  if (MUTATING_METHODS.has(request.method)) {
    enforceCsrf(request);
  }

  return {
    userId: claims.sub,
    username: claims.username,
    role: claims.role,
  };
}

export async function requireRole(
  request: NextRequest,
  roles: UserRole | UserRole[],
): Promise<Session> {
  const session = await requireSession(request);
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(session.role)) {
    throw new ApiError('FORBIDDEN', 'Insufficient permissions', 403);
  }
  return session;
}

function enforceCsrf(request: NextRequest): void {
  const headerToken = request.headers.get('x-csrf-token');
  const cookieToken = request.cookies.get(CSRF_COOKIE)?.value;
  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    throw new ApiError('CSRF_FAILED', 'Missing or invalid CSRF token', 403);
  }
}
