import Link from 'next/link';

import { Logo } from '@/components/layout/logo';
import { ThemeToggle } from '@/components/layout/theme-toggle';

export function AuthShell({
  eyebrow,
  title,
  intro,
  children,
  footer,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Editorial left panel — only visible on wide screens. Acts as the "cover" of the book. */}
      <aside className="relative hidden overflow-hidden border-r border-border/60 bg-card/60 lg:flex lg:flex-col">
        <div className="absolute inset-0 -z-10 bg-paper" />
        <div className="absolute inset-0 -z-10 [background-image:linear-gradient(to_bottom,transparent,var(--color-background))]" />
        <div className="relative flex flex-1 flex-col p-12">
          <Link href="/" className="inline-flex w-fit">
            <Logo />
          </Link>

          <div className="mt-auto max-w-md">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">
              ¶ Reader, welcome
            </p>
            <blockquote className="mt-5 font-display text-3xl leading-[1.15] tracking-tight">
              <span className="block text-[color:var(--color-brand)] text-5xl leading-none">
                &ldquo;
              </span>
              You can&apos;t get a cup of tea big enough or a book long enough to suit me.
            </blockquote>
            <p className="mt-5 text-sm text-muted-foreground">
              — C.S. Lewis, in a letter to a friend
            </p>

            <div className="ornament-rule mt-10" />
            <p className="mt-4 text-xs text-muted-foreground">
              A small, deliberate place to keep the books you&apos;ve read, the ones you&apos;re
              reading, and the ones you&apos;ll never quite finish.
            </p>
          </div>
        </div>
      </aside>

      {/* Form column */}
      <section className="relative flex min-h-screen flex-col bg-background">
        <div className="flex items-center justify-between px-5 py-5 sm:px-8 lg:hidden">
          <Link href="/">
            <Logo />
          </Link>
          <ThemeToggle />
        </div>
        <div className="hidden justify-end px-8 py-5 lg:flex">
          <ThemeToggle />
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 pb-12 sm:px-8">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">{intro}</p>

          <div className="mt-10">{children}</div>

          <div className="mt-8 text-sm text-muted-foreground">{footer}</div>
        </div>
      </section>
    </div>
  );
}
