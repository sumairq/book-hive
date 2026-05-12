import { redirect } from 'next/navigation';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { getSession } from '@/lib/auth/session';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">{children}</main>
      <Footer />
    </>
  );
}
