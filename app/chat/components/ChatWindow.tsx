"use client"

import { useEffect, useRef } from 'react'
import { Chat, Message } from '../types/chat'
import { useChatHistory } from '../hooks/useChatHistory'
import { ChatInput } from './ChatInput'
import { Loader2 } from 'lucide-react'

interface ChatWindowProps {
  currentChat: Chat | null
}

export function ChatWindow({ currentChat }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, isLoading, error, addMessage } = useChatHistory(currentChat?.id)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Debug log
  useEffect(() => {
    console.log('Current messages:', messages)
  }, [messages])

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Выберите чат или создайте новый
      </div>
    )
  }

  const renderMessage = (message: Message) => (
    <div
      key={message.id}
      className={`flex ${message.author === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          message.author === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary'
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-sm">
          {message.text}
        </p>
      </div>
    </div>
  )

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <div className="border-b p-4">
        <h2 className="font-semibold">{currentChat.name}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="text-sm text-destructive text-center p-2 mb-4">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map(renderMessage)}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full text-muted-foreground">
            Нет сообщений
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t mt-auto">
        <ChatInput
          onSendMessage={addMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
