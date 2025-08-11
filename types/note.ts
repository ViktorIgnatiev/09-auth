export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export type NoteTag = 'All' | 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  page: number;
  data: Note[];
  totalPages: number;
  perPage: number;
  total: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}