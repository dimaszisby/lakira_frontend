// utils/auth.ts

import api from "./api";
import ApiResponse from "@/types/generics/ApiResponse";
import { handleApiError } from "./handleApiError";
import {
  CreateUserRequestDTO,
  LoginRequestDTO,
  AuthResponseDTO,
} from "@/types/dtos/user.dto";
import { UserAtom } from "../state/atoms.js";

/**
 * Registers a new user with the provided data.
 * Uses a generic type to make this function reusable for different auth responses.
 * @returns An API response containing a token and user data.
 */
export const registerUser = async (
  userData: CreateUserRequestDTO
): Promise<AuthResponseDTO> => {
  try {
    const response = await api.post<ApiResponse<AuthResponseDTO>>(
      "/auth/register",
      userData
    );
    console.log("registerUser Triggered");

    if (!response.data?.data) {
      throw new Error("Invalid register response"); // ✅ Prevent undefined responses
    }

    return response.data.data;
  } catch (error) {
    console.error("API Error in registerUser:", error);
    throw new Error(handleApiError(error).join(", "));
  }
};

/**
 * Logs in the user with the provided credentials.
 * @returns An API response containing a token and user data.
 */
export const loginUser = async (
  credentials: LoginRequestDTO
): Promise<AuthResponseDTO> => {
  try {
    const response = await api.post<ApiResponse<AuthResponseDTO>>(
      "/auth/login",
      credentials
    );
    console.log("loginUser Triggered");
    if (!response.data?.data) {
      throw new Error("Invalid login response"); // ✅ Prevent undefined responses
    }

    return response.data.data;
  } catch (error) {
    console.error("API Error in loginUser:", error);
    throw new Error(handleApiError(error).join(", "));
  }
};

/**
 * Fetches the user profile of the currently logged-in user.
 * Returns `null` if the request fails instead of throwing an error.
 */
export const fetchUserProfile = async (): Promise<UserAtom | null> => {
  try {
    const response = await api.get<ApiResponse<UserAtom>>("/auth/profile");

    return response.data?.data || null; // returns `null` instead of undefined or throwing an error
  } catch (error) {
    console.error("API Error in fetchUserProfile:", error);
    return null; // ✅ Always return `null` when an error occurs
  }
};

/**
 * Logs out the user.
 * @returns A confirmation message from the API.
 */
export const logoutUser = async (): Promise<
  ApiResponse<{ message: string }>
> => {
  try {
    const response = await api.post<ApiResponse<{ message: string }>>(
      "/auth/logout"
    );
    localStorage.removeItem("token");
    return response.data;
  } catch (error) {
    console.error("API Error in logoutUser:", error);
    throw new Error(handleApiError(error).join(", "));
  }
};
