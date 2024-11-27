// Message-related type definitions
export type Message = {
  id: number;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  sources?: string[];
  isStreaming?: boolean;
}
