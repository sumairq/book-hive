import type { NextRequest } from 'next/server';

import { handleError, ok } from '@/lib/api/response';
import { clearAuthCookies, getRefreshToken } from '@/lib/auth/cookies';
import { logoutUser } from '@/services/auth.service';

export async function POST(_request: NextRequest) {
  try {
    const refresh = await getRefreshToken();
    await logoutUser(refresh);
    await clearAuthCookies();
    return ok({ success: true });
  } catch (err) {
    return handleError(err);
  }
}
