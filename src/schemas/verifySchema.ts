import { z } from "zod";

export const verifySchema = z.object({
    code: z.string().length(6, "Verification code must be 6 digits"),
});

// Schema for verification with username/email
export const verifyAccountSchema = z.object({
    username: z.string().min(1, "Username is required"),
    code: z.string().length(6, "Verification code must be 6 digits"),
});

// Type exports
export type VerifyInput = z.infer<typeof verifySchema>;
export type VerifyAccountInput = z.infer<typeof verifyAccountSchema>;