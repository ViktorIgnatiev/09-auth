'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import css from './NoteForm.module.css';
import type { NoteTag } from '@/types/note';

interface NoteFormProps {
  onSuccess: () => void;
}

export default function NoteForm({ onSuccess }: NoteFormProps) {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tag, setTag] = useState<NoteTag>('Personal');

  const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNoteMutation.mutate({ title, content, tag });
  };

  const isPending = createNoteMutation.isPending;

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <h2 className={css.title}>Create New Note</h2>
      <div className={css.formGroup}>
        <label htmlFor="title" className={css.label}>Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={css.input}
          placeholder="Note title"
          required
          disabled={isPending}
        />
      </div>
      <div className={css.formGroup}>
        <label htmlFor="content" className={css.label}>Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={css.textarea}
          placeholder="Note content"
          required
          disabled={isPending}
        />
      </div>
      <div className={css.formGroup}>
        <label htmlFor="tag" className={css.label}>Tag</label>
        <select
          id="tag"
          value={tag}
          onChange={(e) => setTag(e.target.value as NoteTag)}
          className={css.select}
          disabled={isPending}
        >
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
          <option value="Todo">Todo</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>
      <button
        type="submit"
        className={css.button}
        disabled={isPending || !title || !content}
      >
        {isPending ? 'Creating...' : 'Create Note'}
      </button>
      {createNoteMutation.isError && (
        <p className={css.error}>Error creating note: {createNoteMutation.error.message}</p>
      )}
    </form>
  );
}

