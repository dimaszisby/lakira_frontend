// components/Auth/LoginForm.tsx

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { userAtom } from "@/state/atoms";
import { loginUser } from "@/utils/auth";
import { handleApiError } from "@/utils/handleApiError";
import { LoginRequestDTO } from "@/src/types/dtos/user.dto";
import { loginUserSchema } from "@/types/api/zod-user.schema";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginForm = () => {
  // React Hook Form for form validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequestDTO>({
    resolver: zodResolver(loginUserSchema.shape.body),
  });

  // Jotai state management for user session
  const [, setUser] = useAtom(userAtom);

  // Next.js router for navigation
  const router = useRouter();

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  /**
   * Handles form submission for user login.
   * Uses `useCallback` to optimize re-renders.
   */
  const onSubmit = useCallback(
    async (data: LoginRequestDTO) => {
      setIsLoading(true);
      setServerErrors([]); // Reset errors before submission

      try {
        const response = await loginUser(data);
        console.log("Login API Response:", response); // Debug log

        // Ensure token exists before storing it
        const token = response.token;
        if (token) {
          localStorage.setItem("token", token);
        } else {
          throw new Error("Token missing in response.");
        }

        // Ensure user data exists before setting the state
        const user = response.user;
        if (user) {
          setUser(user);
        } else {
          throw new Error("User data missing in response.");
        }

        // Redirect user to dashboard after successful login
        router.push("/dashboard");
      } catch (error) {
        console.error("Login Error:", error);
        setServerErrors(handleApiError(error)); // Centralized error handling
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, router]
  );

  return (
    <div className="card-xl max-w-md mx-auto">
      <h1 className="text-h1 text-center mb-4">Login</h1>
      <label className="text-body text-text-secondary block text-center mb-8">
        Login using your Lakira Account
      </label>

      {/* Display Server Error Messages */}
      {serverErrors.length > 0 && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
          {serverErrors.map((err, index) => (
            <p key={index}>{err}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email Field */}
        <div className="mb-8 space-y-2">
          <label className="text-input-label">Email</label>
          <input
            {...register("email", { required: "Email is required" })}
            className="input-textfield"
            type="email"
          />
          {errors.email && (
            <span className="text-footer text-text-error block mt-2">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-8 space-y-2">
          <label className="text-input-label">Password</label>
          <input
            {...register("password", { required: "Password is required" })}
            className="input-textfield"
            type="password"
          />
          {errors.password && (
            <span className="text-footer text-text-error block mt-2">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? "Logging In..." : "Log in"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
