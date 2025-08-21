'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { useNoteStore } from '@/lib/store/noteStore';
import css from './NoteForm.module.css';
import type { NoteTag } from '@/types/note';

export default function NoteForm() {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteStore();
  const [title, setTitle] = useState(draft.title);
  const [content, setContent] = useState(draft.content);
  const [tag, setTag] = useState<NoteTag>(draft.tag);

  const queryClient = useQueryClient();

  useEffect(() => {
    setDraft({ title, content, tag });
  }, [title, content, tag, setDraft]);

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.back();
    },
  });

  const handleSubmit = async (formData: FormData) => {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const tag = formData.get('tag') as NoteTag;

    createNoteMutation.mutate({ title, content, tag });
  };

  const handleCancel = () => {
    router.back();
  };

  const isPending = createNoteMutation.isPending;

  return (
    <form className={css.form} action={handleSubmit}>
      <h2 className={css.title}>Create New Note</h2>
      <div className={css.formGroup}>
        <label htmlFor="title" className={css.label}>Title</label>
        <input
          id="title"
          name="title"
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
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={css.textarea}
          placeholder="Note content"
          required
          disabled={isPending}
          rows={6}
        />
      </div>
      <div className={css.formGroup}>
        <label htmlFor="tag" className={css.label}>Tag</label>
        <select
          id="tag"
          name="tag"
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
      <div className={css.buttonGroup}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.button}
          disabled={isPending || !title || !content}
        >
          {isPending ? 'Creating...' : 'Create Note'}
        </button>
      </div>
      {createNoteMutation.isError && (
        <p className={css.error}>Error creating note: {createNoteMutation.error.message}</p>
      )}
    </form>
  );
}