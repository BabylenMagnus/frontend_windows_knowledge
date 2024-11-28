"use client"

import { Chat } from '../types/chat'
import { Storage } from '../types/storage'
import { PlusCircle, MessageCircle, Database, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatListProps {
  chats: Chat[]
  currentChat: Chat | null
  onCreateChat: (name?: string) => void
  onSelectChat: (chat: Chat) => void
  storages: Storage[]
  currentStorage: Storage | null
  onSelectStorage: (storage: Storage) => void
  currentSection: 'chats' | 'storages'
  onSectionChange: (section: 'chats' | 'storages') => void
  isLoading: boolean
  error: string | null
}

export function ChatList({
  chats,
  currentChat,
  onCreateChat,
  onSelectChat,
  storages,
  currentStorage,
  onSelectStorage,
  currentSection,
  onSectionChange,
  isLoading,
  error
}: ChatListProps) {
  console.log('ChatList render:', { chats, currentChat, currentSection }) // Debug log

  return (
    <div className="w-64 border-r bg-background flex flex-col">
      <div className="p-4 border-b">
        <div className="flex gap-2">
          <button
            onClick={() => onSectionChange('chats')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md',
              currentSection === 'chats'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )}
          >
            <MessageCircle className="h-4 w-4" />
            Чаты
          </button>
          <button
            onClick={() => onSectionChange('storages')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md',
              currentSection === 'storages'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )}
          >
            <Database className="h-4 w-4" />
            Хранилища
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {error && (
          <div className="text-sm text-destructive text-center p-2 mb-2">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : currentSection === 'chats' ? (
          <>
            <button
              onClick={() => onCreateChat()}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md mb-2"
            >
              <PlusCircle className="h-4 w-4" />
              Новый чат
            </button>
            
            {chats && chats.length > 0 ? (
              <div className="space-y-1">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md',
                      currentChat?.id === chat.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    )}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="truncate">{chat.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center p-4">
                Нет чатов
              </div>
            )}
          </>
        ) : (
          <div className="space-y-1">
            {storages && storages.length > 0 ? (
              storages.map((storage) => (
                <button
                  key={storage.id}
                  onClick={() => onSelectStorage(storage)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md',
                    currentStorage?.id === storage.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  <Database className="h-4 w-4" />
                  <span className="truncate">{storage.name}</span>
                </button>
              ))
            ) : (
              <div className="text-sm text-muted-foreground text-center p-4">
                Нет хранилищ
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
