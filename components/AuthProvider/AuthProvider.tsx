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

  const { data: currentUser, isLoading, isError } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: !user && pathname !== '/sign-in' && pathname !== '/sign-up', // Не робити запити на auth сторінках
  });

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(false);
      
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        if (requireAuth && pathname !== '/sign-in') {
          router.push('/sign-in');
        }
      }
    }
  }, [currentUser, isLoading, setUser, setIsLoading, requireAuth, router, pathname]);

  if (isLoading && !user && pathname !== '/sign-in' && pathname !== '/sign-up') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <p>Loading, please wait...</p>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated && pathname !== '/sign-in') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
}