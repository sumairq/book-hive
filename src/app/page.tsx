import Link from 'next/link';
import { ArrowUpRight, BookOpen, Bookmark, Users, NotebookPen } from 'lucide-react';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* HERO — asymmetric editorial spread */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-16 pt-12 sm:px-8 md:grid-cols-12 md:pb-24 md:pt-20">
            {/* Vertical book-spine label */}
            <div className="hidden md:col-span-1 md:flex md:items-start md:justify-start">
              <span className="origin-top-left -rotate-90 translate-y-32 whitespace-nowrap font-mono text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">
                vol. i · est. 2026 · for readers
              </span>
            </div>

            <div className="md:col-span-7">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="size-1.5 rounded-full bg-[color:var(--color-brand)]" />
                Now in early access — claim your shelf
              </p>
              <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-foreground sm:text-6xl md:text-[5.5rem]">
                A quiet room
                <br />
                for{' '}
                <span
                  className="italic text-[color:var(--color-brand)]"
                  style={{ fontFeatureSettings: '"ss01"' }}
                >
                  readers
                </span>
                .
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Book Hive is a slow, deliberate space to track what you read, keep margin notes you
                actually revisit, and follow other readers whose taste rewards your time.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Button asChild variant="brand" size="lg" className="group">
                  <Link href="/register">
                    Start your shelf
                    <ArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="lg">
                  <Link href="/login">I already have one</Link>
                </Button>
              </div>

              <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 text-sm">
                <div>
                  <dt className="text-muted-foreground">Open Library</dt>
                  <dd className="mt-1 font-display text-xl">20M+ books</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Notes</dt>
                  <dd className="mt-1 font-display text-xl">Markdown</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Costs</dt>
                  <dd className="mt-1 font-display text-xl">Free</dd>
                </div>
              </dl>
            </div>

            {/* Card stack — feels like books on a shelf */}
            <div className="relative md:col-span-4">
              <div className="absolute inset-0 -z-10 translate-x-6 translate-y-8 rounded-2xl border border-border/50 bg-card/40" />
              <div className="absolute inset-0 -z-10 translate-x-3 translate-y-4 rounded-2xl border border-border/60 bg-card/60" />
              <article className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-7 shadow-sm">
                <div className="ornament-rule mb-6" />
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
                  Currently reading · pg. 142 / 318
                </p>
                <h3 className="mt-3 font-display text-3xl leading-tight">The Lonely City</h3>
                <p className="mt-1 text-sm text-muted-foreground">Olivia Laing</p>

                <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-[color:var(--color-brand)]"
                    style={{ width: '44.6%' }}
                  />
                </div>

                <blockquote className="mt-6 border-l-2 border-[color:var(--color-brand)] pl-4 font-display text-base italic leading-relaxed text-foreground/85">
                  &ldquo;Loneliness is by no means the same as being alone, but neither is it
                  necessarily relieved by company.&rdquo;
                </blockquote>
                <p className="mt-2 text-xs text-muted-foreground">— margin note · 2 days ago</p>

                <div className="mt-7 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Bookmark className="size-3.5" /> 3 notes
                  </span>
                  <span className="size-1 rounded-full bg-border" />
                  <span>14 day streak</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-border/60 bg-card/40">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
            <div className="mb-12 flex items-end justify-between gap-6">
              <h2 className="max-w-xl font-display text-4xl leading-tight tracking-tight md:text-5xl">
                A shelf, a notebook,
                <br />a circle of readers.
              </h2>
              <p className="hidden max-w-xs text-sm text-muted-foreground md:block">
                Three pieces of the practice — built to stay out of your way and reward attention.
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/70 sm:grid-cols-3">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="flex flex-col gap-4 bg-card p-7 transition-colors hover:bg-accent/30"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg border border-[color:var(--color-brand)]/30 bg-[color:var(--color-brand)]/10 text-[color:var(--color-brand)]">
                    <f.icon className="size-5" />
                  </div>
                  <h3 className="font-display text-2xl leading-tight">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing call */}
        <section className="mx-auto w-full max-w-3xl px-5 py-24 text-center sm:px-8">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.4em] text-muted-foreground">
            ¶ Final chapter
          </p>
          <h2 className="mx-auto mt-5 max-w-2xl font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
            What you read shapes who you are.
            <br />
            <span className="italic text-[color:var(--color-brand)]">Keep the receipts.</span>
          </h2>
          <div className="mt-9 flex justify-center">
            <Button asChild variant="brand" size="lg">
              <Link href="/register">Begin a new shelf</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Track without friction.',
    body: 'Add a book in two clicks via Open Library. Currently reading, want-to-read, finished, dropped — your library, your verdict.',
  },
  {
    icon: NotebookPen,
    title: 'Notes worth keeping.',
    body: 'Markdown margin notes tied to each book. Keep them private, or share the ones you want others to see.',
  },
  {
    icon: Users,
    title: 'A small, curious circle.',
    body: 'Follow readers whose taste rewards your time. A feed without algorithms, ads, or noise — just what they’re reading.',
  },
];
