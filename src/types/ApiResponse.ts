import { IMessage } from "@/models/user"; // ✅ make sure your model exports Message

export interface ApiResponse {
  success: boolean;
  message: string; // main message for status
  isAcceptingMessage?: boolean; // optional boolean
  messages?: Array<IMessage>;    // optional array of Message objects
}
