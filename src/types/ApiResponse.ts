import { Message } from "@/models/user";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean; // Changed from isAcceptingMessage to isAcceptingMessages
  messages?: Array<Message>;
}