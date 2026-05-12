import type { NextRequest } from 'next/server';

import { ApiError } from './errors';

/**
 * Phase-1 rate limiter — in-memory token bucket.
 *
 * Replace with @upstash/ratelimit or similar before deploying to serverless
 * (Vercel functions don't share memory across invocations, so in-memory
 * limits give effectively no protection in prod). The `RateLimiter`
 * interface keeps the swap easy.
 */
export interface RateLimiter {
  check(key: string): Promise<{ allowed: boolean; remaining: number; resetAt: number }>;
}

type Bucket = { tokens: number; resetAt: number };

export class InMemoryRateLimiter implements RateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  async check(key: string) {
    const now = Date.now();
    const bucket = this.buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      this.buckets.set(key, { tokens: this.limit - 1, resetAt: now + this.windowMs });
      return { allowed: true, remaining: this.limit - 1, resetAt: now + this.windowMs };
    }

    if (bucket.tokens <= 0) {
      return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
    }

    bucket.tokens -= 1;
    return { allowed: true, remaining: bucket.tokens, resetAt: bucket.resetAt };
  }
}

export const authLimiter = new InMemoryRateLimiter(10, 60_000);

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const real = request.headers.get('x-real-ip');
  if (real) return real;
  return 'unknown';
}

export async function enforceRateLimit(
  request: NextRequest,
  limiter: RateLimiter,
  scope: string,
): Promise<void> {
  const key = `${scope}:${getClientIp(request)}`;
  const result = await limiter.check(key);
  if (!result.allowed) {
    const retryAfter = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000));
    throw new ApiError('RATE_LIMITED', `Too many requests. Retry in ${retryAfter}s.`, 429, {
      retryAfter,
    });
  }
}
