import type { NextRequest } from 'next/server';

import { ApiError } from '@/lib/api/errors';
import { handleError, ok } from '@/lib/api/response';
import { getClientIp } from '@/lib/api/rate-limit';
import { clearAuthCookies, getRefreshToken, setAuthCookies } from '@/lib/auth/cookies';
import { rotateRefresh } from '@/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const refresh = await getRefreshToken();
    if (!refresh) {
      throw new ApiError('UNAUTHENTICATED', 'No refresh token', 401);
    }
    const { accessToken, refreshToken, user } = await rotateRefresh(refresh, {
      ip: getClientIp(request),
      userAgent: request.headers.get('user-agent') ?? undefined,
    });
    await setAuthCookies(accessToken, refreshToken);
    return ok({ user });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      await clearAuthCookies();
    }
    return handleError(err);
  }
}
