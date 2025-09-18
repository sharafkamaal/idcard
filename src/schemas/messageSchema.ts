import { z } from "zod";

export const MessageSchema = z.object({
  content: z
    .string()
    .min(1, "Message content is required")
    .max(500, "Message content must be no more than 500 characters"),
});

export const MessageQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export type MessageInput = z.infer<typeof MessageSchema>;
export type MessageQuery = z.infer<typeof MessageQuerySchema>;