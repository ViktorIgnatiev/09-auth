import { Metadata } from 'next';
import { getServerUser } from '@/lib/api/serverApi';
import ProfileClient from './ProfileClient';
import css from './Profile.module.css';

export const metadata: Metadata = {
  title: 'Profile | NoteHub',
  description: 'View and manage your NoteHub profile',
};

export default async function Profile() {
  const user = await getServerUser();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <a href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </a>
        </div>
        <div className={css.avatarWrapper}>
          <img
            src={user?.avatar || '/default-avatar.png'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user?.username || 'Not set'}</p>
          <p>Email: {user?.email}</p>
        </div>
      </div>
    </main>
  );
}