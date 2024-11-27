import { useState, useCallback } from 'react'
import { messageApi } from '../services/messageApi'
import { ChatRequestBody } from '../types/chat'
import { Message } from '../types/message'

export function useStreamingChat() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const streamChatResponse = useCallback(async (
    requestBody: ChatRequestBody, 
    onContentUpdate: (content: string, sources?: string[]) => void,
    onComplete?: () => void
  ): Promise<{ fullContent: string, sources: string[] }> => {
    setIsStreaming(true)
    setError(null)

    try {
      const stream = await messageApi.streamChatResponse(requestBody)
      
      if (!stream) {
        throw new Error('Failed to get streaming response')
      }

      return await messageApi.parseStreamingResponse(
        stream, 
        onContentUpdate, 
        onComplete
      )
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Неизвестная ошибка при отправке сообщения'
      
      setError(errorMessage)
      
      return { fullContent: '', sources: [] }
    } finally {
      setIsStreaming(false)
    }
  }, [])

  return {
    streamChatResponse,
    isStreaming,
    error
  }
}
