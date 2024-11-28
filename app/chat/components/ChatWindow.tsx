"use client"

import { Chat } from '../types/chat'
import { useChatHistory } from '../hooks/useChatHistory'
import { ChatInput } from './ChatInput'
import { Loader2 } from 'lucide-react'

interface ChatWindowProps {
  chat: Chat
}

export function ChatWindow({ chat }: ChatWindowProps) {
  const { messages, isLoading, error, addMessage } = useChatHistory(chat.id)

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none border-b p-4">
        <h2 className="font-semibold">{chat.name}</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="h-full p-4">
          {error && (
            <div className="text-sm text-destructive text-center p-2 mb-4">
              {error}
            </div>
          )}
          
          {messages && messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.author === 'user' ? 'justify-end' : 'justify-start'
                  }`}
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
              ))}
              {isLoading && (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full text-muted-foreground">
              Начните диалог
            </div>
          )}
        </div>
      </div>

      <div className="flex-none border-t p-4">
        <ChatInput onSendMessage={addMessage} isLoading={isLoading} />
      </div>
    </div>
  )
}
