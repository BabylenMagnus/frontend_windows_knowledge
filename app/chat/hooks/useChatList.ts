import React, { useState, useEffect } from 'react'
import { Chat, Model } from '../types/chat'
import { chatApi } from '../services/chatApi'

export function useChatList() {
  const [chats, setChats] = useState<Chat[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch chats and models on component mount
  useEffect(() => {
    const initializeChatData = async () => {
      setIsLoading(true)
      try {
        const fetchedModels = await chatApi.fetchModels()
        const fetchedChats = await chatApi.fetchChats()

        setModels(fetchedModels)
        setChats(fetchedChats)
      } catch (error) {
        console.error('Error initializing chat data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeChatData()
  }, [])

  // Create a new chat
  const createNewChat = async () => {
    const modelId = models.length > 0 ? models[0].id : 1
    const newChatName = `Новый чат ${chats.length + 1}`

    try {
      const newChat = await chatApi.createChat(newChatName, modelId)
      
      if (newChat) {
        // Add new chat to list and select it
        setChats(prev => [newChat, ...prev])
        setCurrentChat(newChat)
      }
    } catch (error) {
      console.error('Error creating new chat:', error)
    }
  }

  // Select a chat
  const selectChat = (chat: Chat) => {
    setCurrentChat(chat)
  }

  // Update chats list (e.g., after sending a message)
  const updateChatsList = (updatedChat: Chat) => {
    setChats(prev => {
      // Find and update the chat or add if not exists
      const existingChatIndex = prev.findIndex(c => c.id === updatedChat.id)
      
      if (existingChatIndex !== -1) {
        const newChats = [...prev]
        newChats[existingChatIndex] = updatedChat
        
        // Re-sort chats
        return newChats.sort((a, b) => {
          const dateA = new Date(a.lastMessageTimestamp || a.created_at).getTime()
          const dateB = new Date(b.lastMessageTimestamp || b.created_at).getTime()
          return dateB - dateA
        })
      } else {
        return [updatedChat, ...prev]
      }
    })
  }

  return {
    chats,
    models,
    currentChat,
    isLoading,
    createNewChat,
    selectChat,
    updateChatsList,
    setChats
  }
}
