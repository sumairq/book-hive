/**
 * @jest-environment node
 */
import './_setup';
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '@/lib/auth/jwt';

describe('jwt', () => {
  const claims = { userId: '507f1f77bcf86cd799439011', username: 'reader', role: 'user' as const };

  it('signs and verifies an access token, preserving claims', async () => {
    const token = await signAccessToken(claims);
    const payload = await verifyAccessToken(token);
    expect(payload.sub).toBe(claims.userId);
    expect(payload.username).toBe(claims.username);
    expect(payload.role).toBe(claims.role);
  });

  it('signs a refresh token with a jti and verifies it', async () => {
    const { token, jti } = await signRefreshToken({ userId: claims.userId });
    expect(jti).toMatch(/[0-9a-f-]{36}/);
    const payload = await verifyRefreshToken(token);
    expect(payload.sub).toBe(claims.userId);
    expect(payload.jti).toBe(jti);
  });

  it('rejects an access token signed with the refresh secret (cross-secret confusion)', async () => {
    const { token } = await signRefreshToken({ userId: claims.userId });
    await expect(verifyAccessToken(token)).rejects.toThrow();
  });

  it('rejects a tampered token', async () => {
    const token = await signAccessToken(claims);
    const tampered = token.slice(0, -2) + 'xx';
    await expect(verifyAccessToken(tampered)).rejects.toThrow();
  });
});
