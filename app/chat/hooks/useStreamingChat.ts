"use client"

import { useState } from 'react'
import { messageApi } from '../services/messageApi'

export function useStreamingChat() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const streamChatResponse = async (
    query: string,
    chatId: string,
    onChunk: (chunk: string, sources?: any[]) => void,
    onComplete?: () => void
  ) => {
    setIsStreaming(true)
    setError(null)

    try {
      await messageApi.streamChatResponse(
        query,
        chatId,
        onChunk,
        (error) => {
          setError(error.message)
        }
      )
    } finally {
      setIsStreaming(false)
      onComplete?.()
    }
  }

  return {
    streamChatResponse,
    isStreaming,
    error
  }
}
