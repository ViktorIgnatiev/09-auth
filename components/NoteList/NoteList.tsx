import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { deleteNote } from '@/lib/api';
import css from './NoteList.module.css';
import type { Note } from '@/types/note';

interface NoteListProps {
  notes: Note[];
  onNoteDeleted: () => void;
}

const NoteList = ({ notes, onNoteDeleted }: NoteListProps) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onNoteDeleted();
    },
  });

  const handleDelete = useCallback((id: string): void => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation]);

  return (
    <ul className={css.list}>
      {notes.map((note: Note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <div className={css.actions}>
              <Link href={`/notes/${note.id}`} className={css.viewButton} scroll={false}>
                View details
              </Link>
              <button
                className={css.button}
                onClick={() => handleDelete(note.id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;