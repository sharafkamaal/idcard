export interface MessageData {
  title: string;
  content: string;
  received: string;
}

export interface Message {
  id: string;
  content: string;
  createdAt: Date;
  sender?: string;
  isAnonymous: boolean;
}

export interface MessageResponse {
  success: boolean;
  message: string;
  data?: Message[];
}