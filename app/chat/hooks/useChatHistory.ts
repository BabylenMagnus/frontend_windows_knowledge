"use client"

import { useState, useEffect } from 'react'
import { Message } from '../types/chat'
import { fetchChatHistory, sendMessage } from '../services/api'

export function useChatHistory(chatId: number | undefined) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMessages = async () => {
    if (!chatId) {
      setMessages([])
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Fetching messages for chat:', chatId)
      const history = await fetchChatHistory(chatId)
      console.log('Fetched messages:', history)
      
      // Validate and transform messages
      if (Array.isArray(history)) {
        const validMessages = history.filter(msg => 
          msg && 
          typeof msg === 'object' && 
          'id' in msg && 
          'text' in msg &&
          'author' in msg
        ) as Message[]
        
        setMessages(validMessages)
        console.log('Valid messages:', validMessages)
      } else {
        console.warn('Fetched history is not an array:', history)
        setMessages([])
      }
    } catch (err) {
      console.error('Error loading messages:', err)
      setError(err instanceof Error ? err.message : 'Failed to load messages')
    } finally {
      setIsLoading(false)
    }
  }

  const addMessage = async (text: string) => {
    if (!chatId) return

    try {
      // Optimistically add user message
      const userMessage: Message = {
        id: Date.now(),
        text,
        author: 'user',
        chat_id: chatId,
        created_at: new Date().toISOString()
      }
      setMessages(prev => [...prev, userMessage])

      // Send message to backend
      console.log('Sending message:', { chat_id: chatId, text, author: 'user' })
      const response = await sendMessage(chatId, text)
      console.log('Message response:', response)

      if (response && typeof response === 'object' && 'text' in response) {
        // Add assistant message when received
        const assistantMessage: Message = {
          id: Date.now() + 1,
          text: response.text,
          author: 'assistant',
          chat_id: chatId,
          created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        console.warn('Invalid message response:', response)
      }
    } catch (err) {
      console.error('Error sending message:', err)
      setError(err instanceof Error ? err.message : 'Failed to send message')
    }
  }

  useEffect(() => {
    loadMessages()
  }, [chatId])

  return {
    messages,
    isLoading,
    error,
    addMessage,
    refreshMessages: loadMessages
  }
}
