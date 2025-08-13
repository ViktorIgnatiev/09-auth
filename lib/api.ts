import axios from "axios";
import type { Note, FetchNotesParams, FetchNotesResponse, CreateNoteParams } from "@/types/note";

const API_BASE_URL = 'https://notehub-public.goit.study/api';
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search,
  tag
}: FetchNotesParams & { tag?: string }): Promise<FetchNotesResponse> => {
  const params: { page: number; perPage: number; search?: string; tag?: string } = {
    page,
    perPage,
  };

  if (search) params.search = search;
  if (tag && tag !== 'All') params.tag = tag;

  const response = await axios.get('/notes', { params });
  
  return {
    page,
    perPage,
    data: response.data.notes,
    totalPages: response.data.totalPages,
    total: response.data.total
  };
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axios.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (noteData: CreateNoteParams): Promise<Note> => {
  const response = await axios.post<Note>('/notes', noteData);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`/notes/${id}`);
  return response.data;
};

