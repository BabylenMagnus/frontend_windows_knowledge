import { Message } from '../types/message'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8040'

export const messageApi = {
  // Stream chat response
  async streamChatResponse(
    query: string,
    chatId: string,
    onChunk: (chunk: string, sources?: any[]) => void,
    onError?: (error: any) => void
  ): Promise<void> {
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

      let sources: any[] | undefined

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.sources && !sources) {
                sources = data.sources
                onChunk('', sources)
              } else if (data.content) {
                onChunk(data.content, sources)
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
  },

  // Save a message to chat history
  async saveMessage(
    message: Message,
    chatId: string,
    role: 'user' | 'model'
  ): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat_history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          role,
          content: message.content,
          timestamp: message.timestamp,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error saving message:', error)
      throw error
    }
  },

  // Fetch chat history for a specific chat
  async getChatHistory(chatId: string): Promise<Message[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat_history/${chatId}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      return data.messages.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        sender: msg.role === 'user' ? 'user' : 'assistant',
        timestamp: msg.timestamp,
        sources: msg.sources,
      }))
    } catch (error) {
      console.error('Error fetching chat history:', error)
      throw error
    }
  }
}
