import type { NextRequest } from 'next/server';

import { ApiError } from '@/lib/api/errors';
import { handleError, ok } from '@/lib/api/response';
import { getCurrentUser } from '@/lib/auth/session';
import { toPublicUser } from '@/services/auth.service';

export async function GET(_request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new ApiError('UNAUTHENTICATED', 'Not authenticated', 401);
    }
    return ok({ user: toPublicUser(user) });
  } catch (err) {
    return handleError(err);
  }
}
