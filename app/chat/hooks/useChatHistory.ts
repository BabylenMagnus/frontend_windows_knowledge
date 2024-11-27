import React, { useState, useCallback } from 'react'
import { Message } from '../types/message'
import { messageApi } from '../services/messageApi'

export function useChatHistory(chatId?: number) {
  const [messages, setMessages] = useState<Message[]>([])
  const [chatHistoryCache, setChatHistoryCache] = useState<{[chatId: number]: Message[]}>({})
  const [isLoading, setIsLoading] = useState(false)

  // Load chat history
  const loadChatHistory = useCallback(async (id?: number) => {
    if (!id) return []

    // Check cache first
    if (chatHistoryCache[id]) {
      setMessages(chatHistoryCache[id])
      return chatHistoryCache[id]
    }

    setIsLoading(true)
    try {
      const history = await messageApi.fetchChatHistory(id)
      
      // Update cache and messages
      setChatHistoryCache(prev => ({...prev, [id]: history}))
      setMessages(history)
      
      return history
    } catch (error) {
      console.error('Error loading chat history:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [chatHistoryCache])

  // Add a new message
  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message])
    
    // Update cache if chat ID exists
    if (chatId) {
      setChatHistoryCache(prev => {
        const updatedHistory = prev[chatId] 
          ? [...prev[chatId], message]
          : [message]
        
        return {
          ...prev,
          [chatId]: updatedHistory
        }
      })
    }
  }, [chatId])

  // Update last message (for streaming)
  const updateLastMessage = useCallback((content: string, sources?: string[]) => {
    setMessages(prev => {
      if (prev.length === 0) return prev

      const lastMessage = {...prev[prev.length - 1]}
      lastMessage.content = content
      
      if (sources) {
        lastMessage.sources = sources
      }

      return [...prev.slice(0, -1), lastMessage]
    })
  }, [])

  // Save message to backend
  const saveMessage = useCallback(async (message: Message, author: 'user' | 'model') => {
    if (!chatId) return false

    return await messageApi.saveMessage(
      chatId, 
      message.content, 
      author
    )
  }, [chatId])

  return {
    messages,
    chatHistoryCache,
    isLoading,
    loadChatHistory,
    addMessage,
    updateLastMessage,
    saveMessage,
    setMessages
  }
}
