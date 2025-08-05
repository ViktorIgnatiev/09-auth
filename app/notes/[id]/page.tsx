import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import getQueryClient from '@/utils/getQueryClient'
import { fetchNoteById } from '@/lib/api/note'
import NoteDetailsClient from './NoteDetails.client'

interface PageProps {
  params: {
    id: string
  }
}

export default async function NoteDetailsPage({ params }: PageProps) {
  const queryClient = getQueryClient()
  const id = params.id

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