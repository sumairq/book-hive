'use client';

import Link from 'next/link';
import { LogOut, User as UserIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-5 sm:px-8">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden flex-1 items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link
            href="/feed"
            className="transition-colors hover:text-foreground hover:underline hover:decoration-[color:var(--color-brand)] hover:underline-offset-4 hover:decoration-2"
          >
            Feed
          </Link>
          <Link
            href="/books"
            className="transition-colors hover:text-foreground hover:underline hover:decoration-[color:var(--color-brand)] hover:underline-offset-4 hover:decoration-2"
          >
            Discover
          </Link>
          <Link
            href="/dashboard"
            className="transition-colors hover:text-foreground hover:underline hover:decoration-[color:var(--color-brand)] hover:underline-offset-4 hover:decoration-2"
          >
            Library
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 rounded-full border border-border/70 py-1 pl-1 pr-3 text-sm transition-colors hover:bg-accent/40 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Account menu"
                >
                  <Avatar className="size-7">
                    {user.avatarUrl ? <AvatarImage src={user.avatarUrl} /> : null}
                    <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden font-medium sm:inline">{user.username}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-display text-base">
                  {user.username}
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href={`/u/${user.username}`}>
                    <UserIcon /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => void logout()}>
                  <LogOut /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : isLoading ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted/60" aria-hidden />
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild variant="brand" size="sm">
                <Link href="/register">Join the hive</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
