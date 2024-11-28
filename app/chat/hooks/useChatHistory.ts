"use client"

import { useState, useEffect, useCallback } from 'react'
import { Message } from '../types/chat'
import { nanoid } from 'nanoid'
import { fetchChatHistory, streamChatResponse, sendMessage } from '../services/api'

export function useChatHistory(chatId: number) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMessages = useCallback(async () => {
    if (!chatId) return
    
    try {
      const history = await fetchChatHistory(chatId)
      setMessages(history)
    } catch (err) {
      console.error('Error loading messages:', err)
      setError('Не удалось загрузить историю сообщений')
    }
  }, [chatId])

  const addMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: nanoid(),
      text: content,
      author: 'user',
      timestamp: new Date().toISOString(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      await sendMessage(chatId, content, 'user')

      const assistantMessage: Message = {
        id: nanoid(),
        text: '',
        author: 'assistant',
        timestamp: new Date().toISOString(),
      }
      
      setMessages(prev => [...prev, assistantMessage])

      await streamChatResponse({
        chatId,
        query: content,
        onChunk: (chunk) => {
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1]
            if (lastMessage && lastMessage.author === 'assistant') {
              return [
                ...prev.slice(0, -1),
                {
                  ...lastMessage,
                  text: lastMessage.text + chunk
                }
              ]
            }
            return prev
          })
        },
        onError: (err) => {
          console.error('Stream error:', err)
          setError('Произошла ошибка при получении ответа')
          setIsLoading(false)
        },
        onComplete: async () => {
          const lastMessage = messages[messages.length - 1]
          if (lastMessage && lastMessage.author === 'assistant') {
            await sendMessage(chatId, lastMessage.text, 'assistant')
          }
          setIsLoading(false)
        }
      })
    } catch (err) {
      console.error('Chat error:', err)
      setError('Произошла ошибка при отправке сообщения')
      setMessages(prev => prev.slice(0, -1)) // Remove failed message
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  return {
    messages,
    isLoading,
    error,
    addMessage,
    refreshMessages: loadMessages
  }
}
