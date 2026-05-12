import type { NextRequest } from 'next/server';
import type { ZodSchema, ZodTypeDef } from 'zod';

import { ApiError } from './errors';

export async function parseBody<T, Def extends ZodTypeDef = ZodTypeDef, Input = T>(
  request: NextRequest,
  schema: ZodSchema<T, Def, Input>,
): Promise<T> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    throw new ApiError('VALIDATION_FAILED', 'Request body must be valid JSON', 400);
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new ApiError('VALIDATION_FAILED', 'Invalid request body', 422, parsed.error.flatten());
  }
  return parsed.data;
}

export function parseQuery<T, Def extends ZodTypeDef = ZodTypeDef, Input = T>(
  request: NextRequest,
  schema: ZodSchema<T, Def, Input>,
): T {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = schema.safeParse(params);
  if (!parsed.success) {
    throw new ApiError(
      'VALIDATION_FAILED',
      'Invalid query parameters',
      422,
      parsed.error.flatten(),
    );
  }
  return parsed.data;
}
