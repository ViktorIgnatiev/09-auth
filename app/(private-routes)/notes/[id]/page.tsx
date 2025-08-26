import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import getQueryClient from '@/utils/getQueryClient'
import { fetchNoteById } from '@/lib/api'
import NoteDetailsClient from './NoteDetails.client'
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  try {
    const note = await fetchNoteById(id);
    
    return {
      title: `${note.title} | NoteHub`,
      description: note.content.length > 150 
        ? `${note.content.substring(0, 150)}...` 
        : note.content,
      openGraph: {
        title: `${note.title} | NoteHub`,
        description: note.content.length > 150 
          ? `${note.content.substring(0, 150)}...` 
          : note.content,
        url: `https://your-notehub-domain.vercel.app/notes/${id}`,
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
            width: 1200,
            height: 630,
            alt: `NoteHub - ${note.title}`,
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: 'Note Details | NoteHub',
      description: 'View note details in NoteHub application.',
    };
  }
}

export default async function NoteDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const queryClient = getQueryClient()
  const resolvedParams = await params
  const { id } = resolvedParams

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  )
}