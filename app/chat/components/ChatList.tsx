import React from 'react'
import { Brain, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Chat } from '../types/chat'

interface ChatListProps {
  chats: Chat[];
  currentChat?: Chat | null;
  onCreateChat: () => void;
  onSelectChat: (chat: Chat) => void;
}

export function ChatList({ 
  chats, 
  currentChat, 
  onCreateChat, 
  onSelectChat 
}: ChatListProps) {
  return (
    <div className="w-80 border-r flex flex-col">
      <div className="p-4 border-b flex items-center gap-2">
        <Brain className="w-6 h-6" />
        <h1 className="font-semibold">Мои чаты</h1>
        <Button 
          size="icon" 
          variant="ghost" 
          className="ml-auto rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200"
          onClick={onCreateChat}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="space-y-2 p-4">
          {chats.map((chat) => (
            <Card 
              key={chat.id} 
              className={cn(
                "p-3 cursor-pointer hover:bg-accent",
                currentChat?.id === chat.id ? "bg-accent" : ""
              )}
              onClick={() => onSelectChat(chat)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{chat.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {new Date(chat.lastMessageTimestamp || chat.created_at || '').toLocaleString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
