import { Message } from '../types/chat'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8040'

interface StreamChatOptions {
  chatId: number
  query: string
  onChunk: (chunk: string) => void
  onError?: (error: any) => void
  onComplete?: () => void
}

export async function streamChatResponse(options: StreamChatOptions): Promise<void> {
  const { chatId, query, onChunk, onError, onComplete } = options

  try {
    const response = await fetch(`${API_BASE_URL}/chatting_v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        collection_name: 'test',
        chat_id: chatId
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('Response body is null')
    }

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        onComplete?.()
        break
      }

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            if (data.content) {
              onChunk(data.content)
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e)
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in streamChatResponse:', error)
    onError?.(error)
    throw error
  }
}

export async function fetchChatHistory(chatId: number): Promise<Message[]> {
  const response = await fetch(`${API_BASE_URL}/chat_history/${chatId}`)
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  const data = await response.json()
  
  return data.map((item: any) => ({
    id: item.id,
    text: item.text,
    author: item.author === 'model' ? 'assistant' : 'user',
    timestamp: item.created_at
  }))
}

export async function saveMessage(chatId: number, text: string, author: 'user' | 'assistant'): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/chat_history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      author: author === 'assistant' ? 'model' : 'user'
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
}
