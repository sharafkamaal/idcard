import { Message } from "@/models/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean; // Changed from isAcceptingMessage to isAcceptingMessages
  messages?: Array<Message>;
}