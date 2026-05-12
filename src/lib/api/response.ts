import { NextResponse } from 'next/server';

import { ApiError, type ApiErrorCode } from './errors';

export type ApiSuccess<T> = { ok: true; data: T };
export type ApiFailure = {
  ok: false;
  error: { code: ApiErrorCode; message: string; details?: unknown };
};
export type ApiResponseBody<T> = ApiSuccess<T> | ApiFailure;

export function ok<T>(data: T, status = 200): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ ok: true, data }, { status });
}

export function fail(
  code: ApiErrorCode,
  message: string,
  status: number,
  details?: unknown,
): NextResponse<ApiFailure> {
  return NextResponse.json({ ok: false, error: { code, message, details } }, { status });
}

export function handleError(err: unknown): NextResponse<ApiFailure> {
  if (err instanceof ApiError) {
    return fail(err.code, err.message, err.status, err.details);
  }
  if (err instanceof Error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[API]', err);
    }
    return fail('INTERNAL_ERROR', 'An unexpected error occurred', 500);
  }
  return fail('INTERNAL_ERROR', 'An unexpected error occurred', 500);
}
