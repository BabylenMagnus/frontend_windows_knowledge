import React, { useState, useEffect } from 'react'
import { useChatList } from './hooks/useChatList'
import { useChatHistory } from './hooks/useChatHistory'
import { useStreamingChat } from './hooks/useStreamingChat'
import { ChatList } from './components/ChatList'
import { ChatMessages } from './components/ChatMessages'
import { ChatInput } from './components/ChatInput'
import { Message } from './types/message'
import { messageApi } from './api/messageApi' // Assuming messageApi is imported from this file

export default function ChatInterface() {
  const {
    chats, 
    models, 
    currentChat, 
    createNewChat, 
    selectChat
  } = useChatList()

  const {
    messages,
    addMessage,
    updateLastMessage,
    saveMessage
  } = useChatHistory(currentChat?.id)

  const { 
    streamChatResponse, 
    isStreaming,
    error 
  } = useStreamingChat()

  // Send message handler
  const handleSendMessage = async (inputMessage: string) => {
    if (!currentChat) return

    // Create user message
    const userMessage: Message = {
      id: Date.now(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleString(),
    }

    // Add user message and save to backend
    addMessage(userMessage)
    await messageApi.saveMessage(userMessage, currentChat.id, 'user')

    // Prepare for streaming response
    const assistantMessage: Message = {
      id: Date.now() + 1,
      content: '',
      sender: 'assistant',
      timestamp: new Date().toLocaleString(),
      isStreaming: true,
    }

    // Add initial assistant message
    addMessage(assistantMessage)

    try {
      // Stream chat response
      await streamChatResponse(
        inputMessage,
        currentChat.id,
        // Content update callback
        (content, sources) => {
          updateLastMessage(content, sources)
        },
        // Completion callback
        async () => {
          // Get final message content
          const lastMessage = messages[messages.length - 1]
          
          // Save assistant message to backend
          if (lastMessage) {
            await messageApi.saveMessage(
              { ...lastMessage, content: lastMessage.content || '' },
              currentChat.id,
              'model'
            )
          }
        }
      )
    } catch (err) {
      console.error('Chat error:', err)
      
      // Update last message with error
      updateLastMessage(
        `Ошибка: ${error || 'Неизвестная ошибка при отправке сообщения'}`,
        []
      )
    }
  }

  // Load chat history when current chat changes
  useEffect(() => {
    if (currentChat?.id) {
      // Fetch chat history for current chat
    }
  }, [currentChat])

  return (
    <div className="flex h-screen bg-background">
      <ChatList 
        chats={chats}
        currentChat={currentChat}
        onCreateChat={createNewChat}
        onSelectChat={selectChat}
      />

      <div className="flex-1 flex flex-col">
        <ChatMessages 
          messages={messages} 
          isLoading={isStreaming} 
        />
        
        <ChatInput 
          onSendMessage={handleSendMessage}
          isLoading={isStreaming}
        />
      </div>
    </div>
  )
}
