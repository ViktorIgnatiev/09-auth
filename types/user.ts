export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserParams {
  email: string;
  password: string;
}

export interface LoginUserParams {
  email: string;
  password: string;
}

export interface UpdateUserParams {
  username?: string;
  avatar?: string;
}