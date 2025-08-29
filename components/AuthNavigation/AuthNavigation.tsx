'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/authStore';
import { logoutUser } from '@/lib/api/clientApi';
import css from './AuthNavigation.module.css';

export default function AuthNavigation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, clearUser } = useAuthStore();

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      clearUser();
      queryClient.clear();
      // Очищаємо localStorage для надійності
      localStorage.removeItem('auth-storage');
      router.push('/sign-in');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // Все одно очищаємо локальний стан
      clearUser();
      localStorage.removeItem('auth-storage');
      router.push('/sign-in');
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!isAuthenticated) {
    return (
      <div className={css.authNav}>
        <Link href="/sign-in" className={css.navLink} prefetch={false}>
          Login
        </Link>
        <Link href="/sign-up" className={css.navLink} prefetch={false}>
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className={css.authNav}>
      <span className={css.userEmail}>{user?.email}</span>
      <Link href="/profile" className={css.navLink} prefetch={false}>
        Profile
      </Link>
      <button 
        onClick={handleLogout} 
        className={css.logoutButton}
        disabled={logoutMutation.isPending}
      >
        {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}