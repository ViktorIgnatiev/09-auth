import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import getQueryClient from '@/utils/getQueryClient'
import { fetchNoteById } from '@/lib/api/note'
import NoteDetailsClient from './NoteDetails.client'

interface NoteDetailsProps {
  params: Promise<{id:string}>
}

export default async function NoteDetailsPage({ params }: NoteDetailsProps)
{
  const queryClient = getQueryClient()
  const { id } = await params

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