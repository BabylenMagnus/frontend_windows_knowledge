// Chat-related type definitions

export interface Model {
  id: number;
  name: string;
  model_path: string;
  type: 'service' | 'local';
  token?: string;
  context_window: number;
  created_at: string;
  updated_at: string;
}

export interface Chat {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  model_id: number;
}

export interface Message {
  id: number;
  chat_id: number;
  text: string;
  author: 'user' | 'assistant';
  created_at: string;
}

export interface ChatRequestBody {
  query: string;
  chat_id?: number;
}

export interface ChatStreamEvent {
  content?: string;
  sources?: string[];
}

export interface ChatCreate {
  name: string;
  model_id: number;
}

export interface ChatHistoryCreate {
  chat_id: number;
  text: string;
  author: 'user' | 'assistant';
}
