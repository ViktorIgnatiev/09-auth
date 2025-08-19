import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import getQueryClient from '@/utils/getQueryClient';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

export default async function NotesPage({
  params,
}: {
 
  params: { slug: string[] };
}) {
  const queryClient = getQueryClient();
  const tag = params.slug?.[0] || 'All';

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        tag: tag === 'All' ? undefined : tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={tag} />
    </HydrationBoundary>
  );
}