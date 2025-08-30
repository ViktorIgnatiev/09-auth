// components/AuthProvider/AuthProvider.tsx
'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/authStore';
import { getCurrentUser } from '@/lib/api/clientApi';

interface AuthProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthProvider({ children, requireAuth = false }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, setIsLoading, isAuthenticated, user } = useAuthStore();

  const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up';

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: !isAuthPage, // не стукаємо на auth-сторінках
  });

  useEffect(() => {
    setIsLoading(isLoading);
    if (!isLoading) {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        if (requireAuth && !isAuthPage) {
          router.push('/sign-in');
        }
      }
    }
  }, [currentUser, isLoading, setUser, setIsLoading, requireAuth, router, isAuthPage]);

  if (isLoading && !isAuthPage && !user) {
    return (
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'200px' }}>
        <p>Loading, please wait...</p>
      </div>
    );
  }

  return <>{children}</>;
}
