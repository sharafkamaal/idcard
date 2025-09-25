import { z } from "zod";

export const AcceptMessageSchema = z.object({
  acceptMessages: z.boolean().default(false),
});

export type AcceptMessageInput = z.infer<typeof AcceptMessageSchema>;