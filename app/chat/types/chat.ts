// Chat-related type definitions

export type Model = {
  id: number;
  name: string;
  model_path: string;
  type: string;
  context_window: number;
}

export type Chat = {
  id?: number;
  created_at?: string;
  updated_at?: string;
  name: string;
  model_id: number;
  lastMessageTimestamp?: string;
}

export type ChatHistory = {
  id?: number;
  created_at?: string;
  updated_at?: string;
  author: 'model' | 'user';
  chat_id: number;
  text: string;
}

export interface ChatRequestBody {
  query: string;
  collection_name: string;
  chat_id?: number;
}

export interface ChatStreamEvent {
  content?: string;
  sources?: string[];
}
