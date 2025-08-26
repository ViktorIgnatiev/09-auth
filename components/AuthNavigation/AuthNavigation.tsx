'use client';

import { useRouter } from 'next/navigation';
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
      router.push('/sign-in');
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!isAuthenticated) {
    return (
      <div className={css.authNav}>
        <a href="/sign-in" className={css.navLink} prefetch={false}>
          Login
        </a>
        <a href="/sign-up" className={css.navLink} prefetch={false}>
          Sign up
        </a>
      </div>
    );
  }

  return (
    <div className={css.authNav}>
      <span className={css.userEmail}>{user?.email}</span>
      <a href="/profile" className={css.navLink} prefetch={false}>
        Profile
      </a>
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