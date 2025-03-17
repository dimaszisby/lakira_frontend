import api from "./api.js";
import ApiResponse from "@/types/generics/apiResponse.js";
import { handleApiError } from "./handleApiError.js";
import {
  LoginRequestData,
  RegisterUserData,
  AuthResponse,
} from "../types/auth.type.js";
import { UserAtom } from "../atoms/userAtom.js";

/**
 * Registers a new user with the provided data.
 * Uses a generic type to make this function reusable for different auth responses.
 * @returns An API response containing a token and user data.
 */
export const registerUser = async (
  userData: RegisterUserData
): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      userData
    );
    console.log("registerUser Triggered");
    return response.data;
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
  credentials: LoginRequestData
): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      credentials
    );
    console.log("loginUser Triggered");
    return response.data;
  } catch (error) {
    console.error("API Error in loginUser:", error);
    throw new Error(handleApiError(error).join(", "));
  }
};

/**
 * Fetches the user profile of the currently logged-in user.
 * @returns An API response containing the user data.
 */
export const fetchUserProfile = async (): Promise<ApiResponse<UserAtom>> => {
  try {
    const response = await api.get<ApiResponse<UserAtom>>("/auth/profile");
    return response.data;
  } catch (error) {
    console.error("API Error in fetchUserProfile:", error);
    throw new Error(handleApiError(error).join(", "));
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
    return response.data;
  } catch (error) {
    console.error("API Error in logoutUser:", error);
    throw new Error(handleApiError(error).join(", "));
  }
};
