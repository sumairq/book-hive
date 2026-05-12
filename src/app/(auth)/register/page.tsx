import Link from 'next/link';
import type { Metadata } from 'next';

import { AuthShell } from '@/components/auth/auth-shell';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = { title: 'Create account' };

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="¶ Pull up a chair"
      title={
        <>
          Start a new <span className="italic text-[color:var(--color-brand)]">shelf</span>.
        </>
      }
      intro="A reading life, kept together — books, notes, and the people who love them."
      footer={
        <>
          Already keeping a shelf?{' '}
          <Link
            href="/login"
            className="font-medium text-foreground underline decoration-[color:var(--color-brand)] decoration-2 underline-offset-4"
          >
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
