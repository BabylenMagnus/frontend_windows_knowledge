import { 
  ChatRequestBody, 
  ChatStreamEvent 
} from '../types/chat'
import { Message } from '../types/message'

const BASE_URL = 'http://localhost:8040'

export const messageApi = {
  // Save a message to chat history
  async saveMessage(chatId: number, text: string, author: 'user' | 'model'): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/chat_history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          author: author
        })
      })

      return response.ok
    } catch (error) {
      console.error('Error saving message:', error)
      return false
    }
  },

  // Fetch chat history for a specific chat
  async fetchChatHistory(chatId: number, limit?: number, order: 'asc' | 'desc' = 'asc'): Promise<Message[]> {
    try {
      const url = new URL(`${BASE_URL}/chat_history/${chatId}`)
      if (limit) url.searchParams.append('limit', limit.toString())
      url.searchParams.append('order', order)

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const history: any[] = await response.json()
      
      return history.map(entry => ({
        id: entry.id || Date.now(),
        content: entry.text,
        sender: entry.author === 'user' ? 'user' : 'assistant',
        timestamp: entry.created_at || new Date().toLocaleString(),
      }))
    } catch (error) {
      console.error('Error fetching chat history:', error)
      return []
    }
  },

  // Stream chat response
  async streamChatResponse(requestBody: ChatRequestBody): Promise<ReadableStream | null> {
    try {
      const response = await fetch(`${BASE_URL}/chatting_v2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(requestBody),
        mode: 'cors',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, ${await response.text()}`)
      }

      return response.body
    } catch (error) {
      console.error('Chat streaming error:', error)
      return null
    }
  },

  // Parse streaming response
  async parseStreamingResponse(
    stream: ReadableStream, 
    onContentUpdate: (content: string, sources?: string[]) => void,
    onComplete?: () => void
  ): Promise<{ fullContent: string, sources: string[] }> {
    const reader = stream.getReader()
    const decoder = new TextDecoder()
    let fullContent = ''
    let sources: string[] = []

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const events = chunk.split('\n\n')

        events.forEach(event => {
          if (event.startsWith('data: ')) {
            try {
              const parsedData: ChatStreamEvent = JSON.parse(event.slice(6))

              if (parsedData.sources) {
                sources = parsedData.sources
              }

              if (parsedData.content) {
                fullContent += parsedData.content
                onContentUpdate(fullContent, sources)
              }
            } catch (e) {
              console.error('Error parsing event', e)
            }
          }
        })
      }

      onComplete?.()
      return { fullContent, sources }
    } catch (error) {
      console.error('Error parsing streaming response:', error)
      return { fullContent: '', sources: [] }
    }
  }
}
