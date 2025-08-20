// utils/handleApiError.ts

import axios from "axios";

/**
 * Centralized error handler for API calls.
 * @param error - The error object received from API calls.
 * @returns A structured error message array.
 */
export const handleApiError = (error: unknown): string[] => {
  console.error("Full API Error:", error); // Log the full error object
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;
    if (responseData?.status === "fail" && responseData?.message) {
      return [responseData.message]; // Extract message from "fail" response
    }
    if (responseData?.status === "error" && responseData?.message) {
      return [responseData.message]; // Extract message from "error" response
    }
    if (responseData?.errors) return responseData.errors; // Multiple errors
    if (responseData?.error) return [responseData.error]; // Single error
  }
  return ["An unexpected error occurred. Please try again."]; // Fallback error
};
