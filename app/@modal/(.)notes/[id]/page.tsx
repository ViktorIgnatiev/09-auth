import  Modal  from '@/components/Modal/Modal';
import NoteDetailsClient from '@/app/notes/[id]/NoteDetails.client';

export default async function ModalNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return (
    <Modal onClose={() => window.history.back()}>
      <NoteDetailsClient id={id} />
    </Modal>
  );
}