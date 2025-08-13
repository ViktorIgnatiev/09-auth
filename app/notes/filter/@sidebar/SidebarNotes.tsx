import Link from 'next/link';
import css from './SidebarNotes.module.css';
import type { NoteTag } from '@/types/note';

const tags: NoteTag[] = ['All', 'Personal', 'Work', 'Todo', 'Meeting', 'Shopping'];

export default function SidebarNotes() {
  return (
    <ul className={css.menuList}>
      {tags.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link
            href={`/notes/filter/${encodeURIComponent(tag)}`}
            className={css.menuLink}
            prefetch={false}
            >
            {tag}
        </Link>
        </li>
      ))}
    </ul>
  );
}