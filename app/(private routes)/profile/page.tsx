export const dynamic = 'force-dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getServerProfile } from '@/lib/api/serverApi';
import { redirect } from 'next/navigation';
import css from './Profile.module.css';

export const metadata: Metadata = {
  title: 'Profile | NoteHub',
  description: 'Manage your user profile details.',
};

export default async function ProfilePage() {
  const user = await getServerProfile();

  if (!user) {
    console.log('No user found, redirecting to sign-in');
    redirect('/sign-in');
  }

  return (
    <div className={css.container}>
      <h1 className={css.title}>My Profile</h1>
      <div className={css.profileDetails}>
        <div className={css.avatarContainer}>
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.info}>
          <p>
            <strong className={css.label}>Username:</strong> {user.username}
          </p>
          <p>
            <strong className={css.label}>Email:</strong> {user.email}
          </p>
        </div>
      </div>
      <Link href="/profile/edit" className={css.editButton}>
        Edit Profile
      </Link>
    </div>
  );
}