import { z } from "zod";

export const signInSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or username is required")
    .trim(),
  password: z
    .string()
    .min(1, "Password is required"),
});

// Additional schema for password reset request
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .trim(),
});

// Schema for password reset
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must be no more than 100 characters" }),
});

// Type exports
export type SignInInput = z.infer<typeof signInSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;