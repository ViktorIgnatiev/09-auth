// app/(auth-routes)/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthProvider from '@/components/AuthProvider/AuthProvider';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    // вимога ментора: форсити оновлення роутера при монтуванні
    router.refresh();
  }, [router]);

  return <AuthProvider>{children}</AuthProvider>;
}
