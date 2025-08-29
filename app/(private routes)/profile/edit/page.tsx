'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getCurrentUser, updateUser } from '@/lib/api/clientApi';
import css from './EditProfilePage.module.css';

export default function EditProfile() {
  const router = useRouter();
  const [error, setError] = useState('');

  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      router.push('/profile');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Update failed');
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;

    if (!username) {
      setError('Username is required');
      return;
    }

    updateMutation.mutate({ username });
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <img
          src={user?.avatar || '/default-avatar.png'}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              className={css.input}
              defaultValue={user?.username}
              disabled={updateMutation.isPending}
            />
          </div>

          <p>Email: {user?.email}</p>

          <div className={css.actions}>
            <button 
              type="submit" 
              className={css.saveButton}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </button>
            <button 
              type="button" 
              className={css.cancelButton}
              onClick={handleCancel}
              disabled={updateMutation.isPending}
            >
              Cancel
            </button>
          </div>

          {error && <p className={css.error}>{error}</p>}
        </form>
      </div>
    </main>
  );
}