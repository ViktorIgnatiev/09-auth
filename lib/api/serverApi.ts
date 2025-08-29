import { headers } from 'next/headers';
import type { User } from '@/types/user';
import type { Note, FetchNotesParams, FetchNotesResponse } from '@/types/note';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// Server-side API functions
export const getServerUser = async (): Promise<User | null> => {
  try {
    const headersList = await headers();
    const cookie = headersList.get('cookie');
    
    const response = await fetch(`${baseURL}/auth/session`, {
      headers: {
        Cookie: cookie || '',
      },
      credentials: 'include',
      cache: 'no-store'
    });

    // Якщо немає активної сесії - це нормально, повертаємо null
    if (response.status === 401 || response.status === 403 || response.status === 400) {
      return null;
    }

    if (!response.ok) {
      console.error(`Session request failed with status: ${response.status}`);
      return null;
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching server user:', error);
    return null;
  }
};

export const fetchServerNotes = async ({
  page = 1,
  perPage = 12,
  search,
  tag
}: FetchNotesParams & { tag?: string }): Promise<FetchNotesResponse> => {
  try {
    const headersList = await headers();
    const cookie = headersList.get('cookie');
    
    const url = new URL(`${baseURL}/notes`);
    
    // Додаємо параметри запиту
    url.searchParams.set('page', page.toString());
    url.searchParams.set('perPage', perPage.toString());
    if (search) url.searchParams.set('search', search);
    if (tag && tag !== 'All') url.searchParams.set('tag', tag);

    const response = await fetch(url.toString(), {
      headers: {
        Cookie: cookie || '',
      },
      credentials: 'include',
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Authentication required');
      }
      throw new Error(`Failed to fetch notes: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      page: data.page || page,
      perPage: data.perPage || perPage,
      data: data.notes || data.data || [],
      totalPages: data.totalPages || 1,
      total: data.total || 0
    };
  } catch (error) {
    console.error('Error fetching server notes:', error);
    throw error; // Прокидуємо помилку далі для обробки в компоненті
  }
};

export const fetchServerNoteById = async (id: string): Promise<Note> => {
  try {
    const headersList = await headers();
    const cookie = headersList.get('cookie');
    
    const response = await fetch(`${baseURL}/notes/${id}`, {
      headers: {
        Cookie: cookie || '',
      },
      credentials: 'include',
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Authentication required');
      }
      if (response.status === 404) {
        throw new Error('Note not found');
      }
      throw new Error(`Failed to fetch note: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching server note by id:', error);
    throw error; // Прокидуємо помилку далі для обробки в компоненті
  }
};

// Додаткові серверні функції
export const checkServerAuth = async (): Promise<boolean> => {
  try {
    const user = await getServerUser();
    return !!user;
  } catch (error) {
    return false;
  }
};

export const getServerProfile = async (): Promise<User | null> => {
  try {
    const headersList = await headers();
    const cookie = headersList.get('cookie');
    
    const response = await fetch(`${baseURL}/users/me`, {
      headers: {
        Cookie: cookie || '',
      },
      credentials: 'include',
      cache: 'no-store'
    });

    if (response.status === 401 || response.status === 403) {
      return null;
    }

    if (!response.ok) {
      console.error(`Profile request failed with status: ${response.status}`);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching server profile:', error);
    return null;
  }
};