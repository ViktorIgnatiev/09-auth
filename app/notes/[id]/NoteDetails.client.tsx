'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import css from './NoteDetailsClient.module.css';

export default function NoteDetailsClient({ id }: { id: string }) {
  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (isError || !note) {
    return <p>Something went wrong. {error?.message}</p>;
  }

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <div className={css.footer}>
          <span className={css.tag}>{note.tag}</span>
          <p className={css.date}>
            Created: {new Date(note.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}