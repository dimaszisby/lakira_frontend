// types/authType.ts

import { UserAtom } from "@/state/atoms";

/**
 * Represents the request data parameters for register.
 */
export interface RegisterUserData {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  isPublicProfile: boolean;
}

/**
 * Represents the request data parameters for login.
 */
export interface LoginRequestData {
  email: string;
  password: string;
}

/**
 * Defines the structure of authentication-related API responses.
 */
export interface AuthResponse {
  token?: string;
  user?: UserAtom;
}
