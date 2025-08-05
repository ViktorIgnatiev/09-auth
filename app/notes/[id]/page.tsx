import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import getQueryClient from '@/utils/getQueryClient'
import { fetchNoteById } from '@/lib/api/note'
import NoteDetailsClient from './NoteDetails.client'

export default async function NoteDetailsPage({
  params
}: {
  params: { id: string }
}) {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['note', params.id],
    queryFn: () => fetchNoteById(params.id),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={params.id} />
    </HydrationBoundary>
  )
}