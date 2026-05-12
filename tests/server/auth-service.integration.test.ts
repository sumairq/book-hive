/**
 * @jest-environment node
 */
import './_setup';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

const validRegister = {
  email: 'reader@hive.co',
  username: 'silent_reader',
  password: 'Password123',
};

describe('auth.service', () => {
  it('registers a new user and returns tokens + public user', async () => {
    const { registerUser } = await import('@/services/auth.service');
    const result = await registerUser(validRegister);
    expect(result.user.email).toBe(validRegister.email);
    expect(result.user.username).toBe(validRegister.username);
    expect(result.user.role).toBe('user');
    expect(result.accessToken).toMatch(/^eyJ/);
    expect(result.refreshToken).toMatch(/^eyJ/);
    expect(Object.keys(result.user)).not.toContain('passwordHash');
  });

  it('rejects duplicate email at registration', async () => {
    const { registerUser } = await import('@/services/auth.service');
    await registerUser(validRegister);
    await expect(
      registerUser({ ...validRegister, username: 'another_reader' }),
    ).rejects.toMatchObject({ code: 'CONFLICT' });
  });

  it('logs in with email, rejects bad password', async () => {
    const { registerUser, loginUser } = await import('@/services/auth.service');
    await registerUser(validRegister);

    const ok = await loginUser({
      identifier: validRegister.email,
      password: validRegister.password,
    });
    expect(ok.user.username).toBe(validRegister.username);

    await expect(
      loginUser({ identifier: validRegister.email, password: 'wrong-Password123' }),
    ).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });
  });

  it('logs in with username', async () => {
    const { registerUser, loginUser } = await import('@/services/auth.service');
    await registerUser(validRegister);
    const result = await loginUser({
      identifier: validRegister.username,
      password: validRegister.password,
    });
    expect(result.user.email).toBe(validRegister.email);
  });

  it('refresh token rotates and revokes the previous one', async () => {
    const { registerUser, rotateRefresh } = await import('@/services/auth.service');
    const initial = await registerUser(validRegister);

    const rotated = await rotateRefresh(initial.refreshToken);
    expect(rotated.refreshToken).not.toBe(initial.refreshToken);

    // The original refresh token should now be revoked.
    await expect(rotateRefresh(initial.refreshToken)).rejects.toMatchObject({
      code: 'INVALID_TOKEN',
    });
  });

  it('logout revokes the refresh token', async () => {
    const { registerUser, logoutUser, rotateRefresh } = await import('@/services/auth.service');
    const initial = await registerUser(validRegister);
    await logoutUser(initial.refreshToken);
    await expect(rotateRefresh(initial.refreshToken)).rejects.toMatchObject({
      code: 'INVALID_TOKEN',
    });
  });
});
