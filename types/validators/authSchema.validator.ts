import { z } from "zod";

/**
 * Define the validation schema for the register form.
 * Ensures email is a valid format, password is at least 6 characters,
 * and the password and confirmPassword fields match.
 */
export const createUserSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address format" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    passwordConfirmation: z.string().min(6, {
      message: "Password confirmation must be at least 6 characters",
    }),
    isPublicProfile: z.boolean().optional().default(true),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export type CreateUserSchemaType = z.infer<typeof createUserSchema>;

/**
 * Define the validation schema for the login form.
 * Ensures email is a valid format and password is at least 6 characters.
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
