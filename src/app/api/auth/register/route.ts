import type { NextRequest } from 'next/server';

import { handleError, ok } from '@/lib/api/response';
import { parseBody } from '@/lib/api/validate';
import { authLimiter, enforceRateLimit, getClientIp } from '@/lib/api/rate-limit';
import { setAuthCookies } from '@/lib/auth/cookies';
import { registerSchema } from '@/schemas/auth.schema';
import { registerUser } from '@/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    await enforceRateLimit(request, authLimiter, 'auth:register');
    const input = await parseBody(request, registerSchema);
    const { accessToken, refreshToken, user } = await registerUser(input, {
      ip: getClientIp(request),
      userAgent: request.headers.get('user-agent') ?? undefined,
    });
    await setAuthCookies(accessToken, refreshToken);
    return ok({ user }, 201);
  } catch (err) {
    return handleError(err);
  }
}
