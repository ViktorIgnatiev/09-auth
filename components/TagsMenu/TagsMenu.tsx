import Link from 'next/link';
import css from './TagsMenu.module.css';

const tags: NoteTag[] = ['All', 'Personal', 'Work', 'Todo', 'Meeting', 'Shopping'];

export default function TagsMenu() {
  return (
    <div className={css.menuContainer}>
      <button className={css.menuButton}>
        Notes ▾
      </button>
      <ul className={css.menuList}>
        {tags.map((tag) => (
          <li key={tag} className={css.menuItem}>
            <Link 
              href={tag === 'All' ? '/notes/filter' : `/notes/filter/${tag}`}
              className={css.menuLink}
            >
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}