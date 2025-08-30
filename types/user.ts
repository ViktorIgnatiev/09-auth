export interface User {
  email: string;
  username: string;
  avatar: string;
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