// import Modal from '@/components/Modal/Modal';
import NotePreview from '@/app/@modal/(.)notes/[id]/NotePreview.client';

export default async function ModalNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return (
    
      <NotePreview id={id} />
    
  );
}


// return (
//     <Modal onClose={() => window.history.back()}>
//       <NotePreview id={id} />
//     </Modal>
//   );