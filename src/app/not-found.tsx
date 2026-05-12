import Link from 'next/link';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-col items-center px-5 py-32 text-center sm:px-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.4em] text-muted-foreground">
          Chapter not found
        </p>
        <h1 className="mt-4 font-display text-7xl leading-none tracking-tight">404</h1>
        <p className="mt-6 max-w-md text-muted-foreground">
          The page you’re after seems to have wandered off the shelf. Let’s get you back home.
        </p>
        <Button asChild variant="brand" className="mt-8">
          <Link href="/">Back to the lobby</Link>
        </Button>
      </main>
      <Footer />
    </>
  );
}
