'use client';

import * as React from 'react';

import { useAuthStore } from '@/store/auth.store';

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);

  React.useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return <>{children}</>;
}
