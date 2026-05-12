/**
 * Shared test env. Sets the required env vars BEFORE any module that depends
 * on `@/lib/env` is imported. Server-side tests should `import './_setup'`
 * as their first line.
 */
process.env.JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET ?? 'test-access-secret-must-be-at-least-32-chars-long';
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ?? 'test-refresh-secret-must-be-different-but-also-32+chars';
process.env.MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/book-hive-test';
process.env.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
if (!process.env.NODE_ENV) {
  // Jest runs with NODE_ENV=test by default; this just guards lone-script use.
  Object.defineProperty(process.env, 'NODE_ENV', { value: 'test', writable: true });
}
