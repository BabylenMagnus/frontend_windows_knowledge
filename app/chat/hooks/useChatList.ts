"use client"

import { useState, useEffect } from 'react'
import { Chat } from '../types/chat'
import { fetchChats, createChat as apiCreateChat } from '../services/api'

export function useChatList() {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadChats = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchChats()
      console.log('Fetched chats:', data)
      setChats(data)
    } catch (err) {
      console.error('Error loading chats:', err)
      setError(err instanceof Error ? err.message : 'Failed to load chats')
    } finally {
      setIsLoading(false)
    }
  }

  const createChat = async (name: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const newChat = await apiCreateChat(name, 1) // Using model_id 1 as default
      console.log('Created chat:', newChat)
      setChats(prev => [...prev, newChat])
      return newChat
    } catch (err) {
      console.error('Error creating chat:', err)
      setError(err instanceof Error ? err.message : 'Failed to create chat')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const selectChat = (chat: Chat) => {
    console.log('Selecting chat:', chat)
    setCurrentChat(chat)
  }

  useEffect(() => {
    loadChats()
  }, [])

  return {
    chats,
    currentChat,
    isLoading,
    error,
    createChat,
    selectChat,
    refreshChats: loadChats,
  }
}
