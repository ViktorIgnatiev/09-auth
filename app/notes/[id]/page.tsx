import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import getQueryClient from '@/utils/getQueryClient'
import { fetchNoteById } from '@/lib/api/note'
import NoteDetailsClient from './NoteDetails.client'

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