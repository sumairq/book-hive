/**
 * @jest-environment node
 */
import './_setup';
import { comparePassword, hashPassword } from '@/lib/auth/password';

describe('password hashing', () => {
  it('hashes a password to a non-empty string different from the input', async () => {
    const hash = await hashPassword('hunter2_HuntER');
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(20);
    expect(hash).not.toEqual('hunter2_HuntER');
  });

  it('produces different hashes for the same password (salt is randomized)', async () => {
    const a = await hashPassword('Password123');
    const b = await hashPassword('Password123');
    expect(a).not.toEqual(b);
  });

  it('verifies a correct password', async () => {
    const hash = await hashPassword('Password123');
    await expect(comparePassword('Password123', hash)).resolves.toBe(true);
  });

  it('rejects an incorrect password', async () => {
    const hash = await hashPassword('Password123');
    await expect(comparePassword('Password124', hash)).resolves.toBe(false);
  });
});
