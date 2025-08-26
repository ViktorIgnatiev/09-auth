import { Metadata } from 'next';
import AuthProvider from '@/components/AuthProvider/AuthProvider';

export const metadata: Metadata = {
  title: 'Private Content | NoteHub',
  description: 'Access your private content in NoteHub',
};

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider requireAuth={true}>
      {children}
    </AuthProvider>
  );
}