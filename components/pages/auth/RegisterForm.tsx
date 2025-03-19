import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { handleApiError } from "../../../utils/handleApiError";
import { userAtom } from "../../../state/atoms";
import { registerUser } from "../../../utils/auth.js";
import {
  createUserSchema,
  CreateUserSchemaType,
} from "../../../types/validators/authSchema.validator";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<CreateUserSchemaType>({
    resolver: zodResolver(createUserSchema),
    mode: "onChange",
  });

  const [, setUser] = useAtom(userAtom);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  // Watch password and passwordConfirmation for live validation
  const password = watch("password");
  const passwordConfirmation = watch("passwordConfirmation");

  /**
   * Handles form submission for user registration.
   * Uses `useCallback` to optimize re-renders.
   */
  const onSubmit = useCallback(
    async (data: CreateUserSchemaType) => {
      setIsLoading(true);
      setServerErrors([]);

      try {
        const response = await registerUser(data);
        console.log("Register API Response:", response);

        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
        } else {
          throw new Error("Token missing in response.");
        }

        if (response.data?.user) {
          setUser(response.data.user);
        } else {
          throw new Error("User data missing in response.");
        }

        router.push("/dashboard");
      } catch (error) {
        console.error("Register Error:", error);
        setServerErrors(handleApiError(error));
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, router]
  );

  return (
    <div className="card-xl max-w-md mx-auto">
      <h1 className="text-h1 text-center mb-4">Register</h1>
      <label className="text-body text-text-secondary block text-center mb-8">
        Create your Lakira Account
      </label>

      {serverErrors.length > 0 && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
          {serverErrors.map((err, index) => (
            <p key={index}>{err}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Username Field */}
        <div className="mb-6 space-y-2">
          <label className="text-input-label">Username</label>
          <input
            {...register("username")}
            className="input-textfield"
            type="text"
          />
          {errors.username && (
            <span className="text-footer text-text-error block mt-2">
              {errors.username.message}
            </span>
          )}
        </div>

        {/* Email Field */}
        <div className="mb-6 space-y-2">
          <label className="text-input-label">Email</label>
          <input
            {...register("email")}
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
        <div className="mb-6 space-y-2">
          <label className="text-input-label">Password</label>
          <input
            {...register("password")}
            className="input-textfield"
            type="password"
          />
          {errors.password && (
            <span className="text-footer text-text-error block mt-2">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="mb-6 space-y-2">
          <label className="text-input-label">Confirm Password</label>
          <input
            {...register("passwordConfirmation")}
            className="input-textfield"
            type="password"
          />
          {passwordConfirmation && password !== passwordConfirmation && (
            <span className="text-footer text-text-error block mt-2">
              Passwords do not match
            </span>
          )}
          {errors.passwordConfirmation && (
            <span className="text-footer text-text-error block mt-2">
              {errors.passwordConfirmation.message}
            </span>
          )}
        </div>

        {/* Public Profile Toggle */}
        <div className="mb-6 flex items-center gap-2">
          <input type="checkbox" {...register("isPublicProfile")} />
          <label className="text-body">Make my profile public</label>
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={!isValid || isLoading}
        >
          {isLoading ? "Registering..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
