import type { NextRequest } from 'next/server';

import { handleError, ok } from '@/lib/api/response';
import { parseBody } from '@/lib/api/validate';
import { authLimiter, enforceRateLimit, getClientIp } from '@/lib/api/rate-limit';
import { setAuthCookies } from '@/lib/auth/cookies';
import { loginSchema } from '@/schemas/auth.schema';
import { loginUser } from '@/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    await enforceRateLimit(request, authLimiter, 'auth:login');
    const input = await parseBody(request, loginSchema);
    const { accessToken, refreshToken, user } = await loginUser(input, {
      ip: getClientIp(request),
      userAgent: request.headers.get('user-agent') ?? undefined,
    });
    await setAuthCookies(accessToken, refreshToken);
    return ok({ user });
  } catch (err) {
    return handleError(err);
  }
}
