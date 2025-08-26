'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/authStore';
import { getCurrentUser } from '@/lib/api/clientApi';
import css from './AuthProvider.module.css';

interface AuthProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthProvider({ children, requireAuth = false }: AuthProviderProps) {
  const router = useRouter();
  const { setUser, setIsLoading, isAuthenticated } = useAuthStore();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
  });

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(false);
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        if (requireAuth) {
          router.push('/sign-in');
        }
      }
    }
  }, [user, isLoading, setUser, setIsLoading, requireAuth, router]);

  if (isLoading) {
    return (
      <div className={css.loaderContainer}>
        <p>Loading, please wait...</p>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}