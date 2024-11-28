"use client"

import { useState } from 'react'

export function useStreamingChat() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const streamMessage = async (content: string, chatId: number): Promise<string> => {
    setIsStreaming(true)
    setError(null)

    try {
      // Имитация задержки стриминга
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Мок ответа
      const response = `Это тестовый ответ на ваше сообщение: "${content}"`
      
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при отправке сообщения')
      throw err
    } finally {
      setIsStreaming(false)
    }
  }

  return {
    isStreaming,
    streamMessage,
    error
  }
}
