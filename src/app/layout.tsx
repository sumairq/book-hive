import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { AuthBootstrap } from '@/components/providers/auth-bootstrap';
import { Toaster } from '@/components/ui/sonner';

import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['opsz', 'SOFT'],
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: {
    default: 'Book Hive — a quiet room for readers',
    template: '%s · Book Hive',
  },
  description:
    'Track what you read, share what you love, find your next chapter. A social reading tracker for thoughtful readers.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-paper antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthBootstrap>
              {children}
              <Toaster position="bottom-right" richColors />
            </AuthBootstrap>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
