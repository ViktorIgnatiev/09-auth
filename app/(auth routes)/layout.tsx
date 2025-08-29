import { Metadata } from 'next';
import AuthProvider from '@/components/AuthProvider/AuthProvider';

export const metadata: Metadata = {
  title: 'Authentication | NoteHub',
  description: 'Sign in or sign up to NoteHub',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}