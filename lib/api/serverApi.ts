import { cookies } from 'next/headers';
import axios from 'axios';
import type { User } from '@/types/user';
import type { Note, FetchNotesParams, FetchNotesResponse } from '@/types/note';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Додайте інтерцептор для логування
api.interceptors.request.use((config) => {
  console.log('Server API Request:', config.method?.toUpperCase(), config.url);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('Server API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Server API Error:', error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);

export const getServerUser = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    
    // Формуємо правильний Cookie header
    const cookieHeader = allCookies
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');

    console.log('Server user check - cookies:', allCookies.length);
    
    if (!cookieHeader) {
      console.log('No cookies found for server user check');
      return null;
    }

    const response = await api.get('/auth/session', {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching server user:', error);
    return null;
  }
};

export const getServerProfile = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    
    const cookieHeader = allCookies
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');

    console.log('Server profile check - cookies:', allCookies.length);
    
    if (!cookieHeader) {
      console.log('No cookies found for server profile check');
      return null;
    }

    const response = await api.get('/users/me', {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching server profile:', error);
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
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    
    const cookieHeader = allCookies
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');

    const params: Record<string, any> = {
      page,
      perPage: perPage || 12,
    };
    
    if (search) params.search = search;
    if (tag && tag !== 'All') params.tag = tag;

    const response = await api.get('/notes', {
      params,
      headers: {
        Cookie: cookieHeader,
      },
    });

    return {
      page: response.data.page || page,
      perPage: response.data.perPage || perPage,
      data: response.data.notes || response.data.data || [],
      totalPages: response.data.totalPages || 1,
      total: response.data.total || 0,
    };
  } catch (error) {
    console.error('Error fetching server notes:', error);
    throw error;
  }
};

export const fetchServerNoteById = async (id: string): Promise<Note> => {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    
    const cookieHeader = allCookies
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');

    const response = await api.get(`/notes/${id}`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (response.status === 200) {
      return response.data;
    }
    throw new Error(`Failed to fetch note: ${response.status}`);
  } catch (error) {
    console.error('Error fetching server note by id:', error);
    throw error;
  }
};

export const checkServerAuth = async (): Promise<boolean> => {
  try {
    const user = await getServerUser();
    return !!user;
  } catch (error) {
    return false;
  }
};

// Додаткова функція для перевірки сесії (для middleware)
export const getServerSession = async (): Promise<{ user: User | null }> => {
  try {
    const user = await getServerUser();
    return { user };
  } catch (error) {
    return { user: null };
  }
};