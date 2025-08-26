import { api } from './api';
import type { User, CreateUserParams, LoginUserParams, UpdateUserParams } from '@/types/user';
import type { Note, FetchNotesParams, FetchNotesResponse, CreateNoteParams } from '@/types/note';

// Auth API
export const loginUser = async (credentials: LoginUserParams): Promise<User> => {
  const response = await api.post<User>('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData: CreateUserParams): Promise<User> => {
  const response = await api.post<User>('/auth/register', userData);
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get<User>('/auth/session');
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getProfile = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');
  return response.data;
};

export const updateUser = async (userData: UpdateUserParams): Promise<User> => {
  const response = await api.patch<User>('/users/me', userData);
  return response.data;
};

// Notes API
export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search,
  tag
}: FetchNotesParams & { tag?: string }): Promise<FetchNotesResponse> => {
  const params: Record<string, any> = {
    page,
    perPage: perPage || 12,
  };

  if (search) params.search = search;
  if (tag && tag !== 'All') params.tag = tag;

  const response = await api.get('/notes', { params });
  
  return {
    page: response.data.page || page,
    perPage: response.data.perPage || perPage,
    data: response.data.notes || response.data.data || [],
    totalPages: response.data.totalPages || 1,
    total: response.data.total || 0
  };
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (noteData: CreateNoteParams): Promise<Note> => {
  const response = await api.post<Note>('/notes', noteData);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};

// Додаткові утиліти для перевірки авторизації
export const checkAuth = async (): Promise<boolean> => {
  try {
    await api.get('/auth/session');
    return true;
  } catch (error) {
    return false;
  }
};