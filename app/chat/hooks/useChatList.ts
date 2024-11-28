"use client"

import { useState, useEffect } from 'react'
import { Chat } from '../types/chat'
import { fetchChats, createChat } from '../services/api'

export function useChatList() {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadChats = async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log('Fetching chats...')
      const fetchedChats = await fetchChats()
      console.log('Fetched chats:', fetchedChats)
      
      // Ensure we have an array of chats with required fields
      if (Array.isArray(fetchedChats)) {
        const validChats = fetchedChats.filter(chat => 
          chat && 
          typeof chat === 'object' && 
          'id' in chat && 
          'name' in chat
        ) as Chat[]
        
        setChats(validChats)
        console.log('Valid chats:', validChats)
      } else {
        console.warn('Fetched chats is not an array:', fetchedChats)
        setChats([])
      }
    } catch (err) {
      console.error('Error loading chats:', err)
      setError(err instanceof Error ? err.message : 'Failed to load chats')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateChat = async (name: string = 'Новый чат') => {
    try {
      console.log('Creating new chat:', name)
      const newChat = await createChat(name, 1) // Using model_id 1 as default
      console.log('Created chat:', newChat)
      
      if (newChat && typeof newChat === 'object' && 'id' in newChat) {
        const chat = newChat as Chat
        setChats(prev => [...prev, chat])
        setCurrentChat(chat)
        console.log('Added new chat to list')
      } else {
        console.warn('Invalid new chat data:', newChat)
        throw new Error('Invalid chat data received from server')
      }
    } catch (err) {
      console.error('Error creating chat:', err)
      setError(err instanceof Error ? err.message : 'Failed to create chat')
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
    createNewChat: handleCreateChat,
    selectChat,
    refreshChats: loadChats
  }
}
