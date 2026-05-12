import Link from 'next/link';

import { Logo } from './logo';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 sm:grid-cols-[1.4fr_1fr_1fr] sm:px-8">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            A quiet room for readers. Track what you read, share what you love, find your next
            chapter.
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <h4 className="font-display text-base text-foreground">Product</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link className="hover:text-foreground" href="/books">
                Discover
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground" href="/feed">
                Feed
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground" href="/dashboard">
                Library
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-3 text-sm">
          <h4 className="font-display text-base text-foreground">Account</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link className="hover:text-foreground" href="/login">
                Sign in
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground" href="/register">
                Create account
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 text-xs text-muted-foreground sm:px-8">
          <span>© {new Date().getFullYear()} Book Hive · Built for readers.</span>
          <span className="font-mono uppercase tracking-[0.2em]">v0.1</span>
        </div>
      </div>
    </footer>
  );
}
