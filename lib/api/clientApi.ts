// lib/api/clientApi.ts
import { api } from './api';
import type { User, CreateUserParams, LoginUserParams, UpdateUserParams } from '@/types/user';
import type { Note, FetchNotesParams, FetchNotesResponse, CreateNoteParams } from '@/types/note';

// !!! НІЯКИХ токенів у localStorage, усе тільки через HttpOnly cookies,
// які виставляють ваші app/api/auth/* маршрути.

export const loginUser = async (credentials: LoginUserParams): Promise<User> => {
  const { data } = await api.post<User>('auth/login', credentials);
  return data;
};

export const registerUser = async (userData: CreateUserParams): Promise<User> => {
  const { data } = await api.post<User>('auth/register', userData);
  return data;
};

export const logoutUser = async (): Promise<void> => {
  await api.post('auth/logout');
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // якщо сесія активна (accessToken є у cookies) — бек поверне користувача
    const { data } = await api.get<User>('auth/session');
    return data;
  } catch {
    return null;
  }
};

export const getProfile = async (): Promise<User> => {
  const { data } = await api.get<User>('users/me');
  return data;
};

export const updateUser = async (userData: UpdateUserParams): Promise<User> => {
  const { data } = await api.patch<User>('users/me', userData);
  return data;
};

// Notes API
export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search,
  tag
}: FetchNotesParams & { tag?: string }): Promise<FetchNotesResponse> => {
  const params: Record<string, any> = { page, perPage: perPage || 12 };
  if (search) params.search = search;
  if (tag && tag !== 'All') params.tag = tag;

  const res = await api.get('notes', { params });
  return {
    page: res.data.page || page,
    perPage: res.data.perPage || perPage,
    data: res.data.notes || res.data.data || [],
    totalPages: res.data.totalPages || 1,
    total: res.data.total || 0,
  };
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`notes/${id}`);
  return data;
};

export const createNote = async (noteData: CreateNoteParams): Promise<Note> => {
  const { data } = await api.post<Note>('notes', noteData);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`notes/${id}`);
  return data;
};

export const checkAuth = async (): Promise<boolean> => {
  try {
    await api.get('auth/session');
    return true;
  } catch {
    return false;
  }
};
