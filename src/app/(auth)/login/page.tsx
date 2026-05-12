import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

import { AuthShell } from '@/components/auth/auth-shell';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = { title: 'Sign in' };

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="¶ Returning reader"
      title={
        <>
          Welcome <span className="italic text-[color:var(--color-brand)]">back</span>.
        </>
      }
      intro="Sign in to pick up where you left off."
      footer={
        <>
          New here?{' '}
          <Link
            href="/register"
            className="font-medium text-foreground underline decoration-[color:var(--color-brand)] decoration-2 underline-offset-4"
          >
            Start a shelf
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="h-64 animate-pulse rounded-md bg-muted/40" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
