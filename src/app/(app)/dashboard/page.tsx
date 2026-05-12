import type { Metadata } from 'next';

import { getCurrentUser } from '@/lib/auth/session';

export const metadata: Metadata = { title: 'Library' };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const displayName = user?.username ?? 'reader';

  return (
    <div className="py-12">
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">
        ¶ Your library
      </p>
      <h1 className="mt-3 font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">
        Hello, <span className="italic text-[color:var(--color-brand)]">{displayName}</span>.
      </h1>
      <p className="mt-6 max-w-prose text-muted-foreground">
        Your shelf is ready. The reading dashboard — currently reading, finished, want-to-read,
        notes, streaks, goals — lands in the next phase. For now, your account is set up and your
        session is live.
      </p>

      <div className="ornament-rule my-10" />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Currently reading', value: '—' },
          { label: 'Finished', value: '—' },
          { label: 'Want to read', value: '—' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border/70 bg-card p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-display text-4xl">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
