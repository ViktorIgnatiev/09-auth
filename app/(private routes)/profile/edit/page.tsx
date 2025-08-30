'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateUser } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './EditProfilePage.module.css';

export default function ProfileEditPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000,
  });

  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setAvatar(user.avatar);
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      // Update the global state with the new user data
      setUser(updatedUser);
      // Invalidate the query to refetch fresh data on next access
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      // Navigate back
      router.back();
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
      // Optional: show an error message to the user
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ username, avatar });
  };

  if (isLoading) {
    return <p className={css.message}>Loading profile data...</p>;
  }

  if (isError) {
    return <p className={css.error}>Failed to load profile data.</p>;
  }

  if (!user) {
    return <p className={css.message}>User not found.</p>;
  }

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <h1 className={css.title}>Edit Profile</h1>
      <div className={css.formGroup}>
        <label htmlFor="email" className={css.label}>Email</label>
        <input id="email" type="email" value={user.email} className={css.input} disabled />
      </div>
      <div className={css.formGroup}>
        <label htmlFor="username" className={css.label}>Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={css.input}
          disabled={updateMutation.isPending}
          required
        />
      </div>
      <div className={css.formGroup}>
        <label htmlFor="avatar" className={css.label}>Avatar URL</label>
        <input
          id="avatar"
          type="url"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          className={css.input}
          disabled={updateMutation.isPending}
          required
        />
      </div>
      <div className={css.buttonGroup}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
          disabled={updateMutation.isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.saveButton}
          disabled={updateMutation.isPending || !username || !avatar}
        >
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      {updateMutation.isError && (
        <p className={css.error}>Error updating profile: {updateMutation.error.message}</p>
      )}
    </form>
  );
}