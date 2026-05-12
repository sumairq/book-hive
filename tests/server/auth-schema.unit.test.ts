/**
 * @jest-environment node
 */
import './_setup';
import { loginSchema, registerSchema } from '@/schemas/auth.schema';

describe('registerSchema', () => {
  it('accepts a valid registration', () => {
    const result = registerSchema.safeParse({
      email: 'reader@hive.co',
      username: 'silent_reader',
      password: 'Password123',
    });
    expect(result.success).toBe(true);
  });

  it('lowercases the email', () => {
    const result = registerSchema.safeParse({
      email: 'Reader@HIVE.co',
      username: 'silent_reader',
      password: 'Password123',
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe('reader@hive.co');
  });

  it.each([
    ['short', 'Pw1aA'],
    ['no-upper', 'password123'],
    ['no-lower', 'PASSWORD123'],
    ['no-digit', 'PasswordABC'],
  ])('rejects %s passwords', (_, password) => {
    const result = registerSchema.safeParse({
      email: 'reader@hive.co',
      username: 'silent_reader',
      password,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid usernames', () => {
    const result = registerSchema.safeParse({
      email: 'reader@hive.co',
      username: 'silent reader!',
      password: 'Password123',
    });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts identifier + password', () => {
    expect(loginSchema.safeParse({ identifier: 'reader', password: 'x' }).success).toBe(true);
  });

  it('rejects empty fields', () => {
    expect(loginSchema.safeParse({ identifier: '', password: 'x' }).success).toBe(false);
    expect(loginSchema.safeParse({ identifier: 'reader', password: '' }).success).toBe(false);
  });
});
