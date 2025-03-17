// types/ApiResponse.ts

/**
 * Generic API Response Type for Authentication requests.
 * This ensures flexibility in handling different API responses.
 */
interface ApiResponse<T> {
  data?: T;
  error?: string;
  errors?: string[];
}

export default ApiResponse;
