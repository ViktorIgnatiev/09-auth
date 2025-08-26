import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import getQueryClient from '@/utils/getQueryClient';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const tag = resolvedParams.slug?.[0] || 'All';
  
  return {
    title: `${tag} Notes | NoteHub`,
    description: `Browse ${tag.toLowerCase()} notes in your NoteHub application.`,
    openGraph: {
      title: `${tag} Notes | NoteHub`,
      description: `Browse ${tag.toLowerCase()} notes in NoteHub.`,
      url: `https://your-notehub-domain.vercel.app/notes/filter/${tag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `NoteHub - ${tag} Notes`,
        },
      ],
    },
  };
}

export default async function NotesPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const queryClient = getQueryClient();
  const resolvedParams = await params;
  const tag = resolvedParams.slug?.[0] || 'All';

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () => fetchNotes({
      page: 1,
      perPage: 12,
      tag: tag === 'All' ? undefined : tag
    }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={tag} />
    </HydrationBoundary>
  );
}