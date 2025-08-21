'use client';

import { useState } from 'react';
import Link from 'next/link';
import css from './TagsMenu.module.css';
import type { NoteTag } from '@/types/note';

const tags: NoteTag[] = ['All', 'Personal', 'Work', 'Todo', 'Meeting', 'Shopping'];

export default function TagsMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={css.menuContainer}>
      <button 
        className={css.menuButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        Notes ▾
      </button>
      
      {isOpen && (
        <ul className={css.menuList}>
          {tags.map((tag) => (
            <li key={tag} className={css.menuItem}>
              <Link
                href={tag === 'All' ? '/notes/filter/All' : `/notes/filter/${tag}`}
                className={css.menuLink}
                onClick={() => setIsOpen(false)}
                prefetch={false}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}