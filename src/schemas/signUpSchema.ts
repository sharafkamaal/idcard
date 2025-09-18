import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(20, "Username must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .max(100, { message: "Password must be no more than 100 characters" }),
});

export const verifySchema = z.object({
    code: z.string().length(6, "Verification code must be 6 digits"),
});

// Type exports
export type SignUpInput = z.infer<typeof signUpSchema>;
export type VerifyInput = z.infer<typeof verifySchema>;