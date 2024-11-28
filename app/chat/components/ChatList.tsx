"use client"

import { useState } from 'react'
import { Chat } from '../types/chat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, MessageCircle } from 'lucide-react'

interface ChatListProps {
  chats: Chat[]
  currentChat: Chat | null
  isLoading: boolean
  onChatCreate: (name: string) => void
  onChatSelect: (chat: Chat) => void
  error?: string | null
}

export function ChatList({
  chats,
  currentChat,
  isLoading,
  onChatCreate,
  onChatSelect,
  error,
}: ChatListProps) {
  const [newChatName, setNewChatName] = useState('')

  const handleCreateChat = () => {
    if (newChatName.trim()) {
      onChatCreate(newChatName.trim())
      setNewChatName('')
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Новый чат"
            value={newChatName}
            onChange={(e) => setNewChatName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateChat()}
          />
          <Button
            size="icon"
            variant="outline"
            onClick={handleCreateChat}
            disabled={!newChatName.trim() || isLoading}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {error && (
          <div className="text-sm text-destructive p-2 mb-2 bg-destructive/10 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin">⌛</div>
          </div>
        ) : chats.length > 0 ? (
          <div className="space-y-1">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onChatSelect(chat)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg ${
                  currentChat?.id === chat.id
                    ? 'bg-secondary'
                    : 'hover:bg-secondary/50'
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="truncate">{chat.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 text-muted-foreground">
            Нет активных чатов
          </div>
        )}
      </div>
    </div>
  )
}
