export interface User {
  id: number;
  email: string;
  passwordHash: string;
  role: string;
}

export interface UserRegisterInput {
  email: string;
  password: string;
  role?: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}
