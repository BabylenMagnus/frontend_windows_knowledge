"use client"

import { useState } from 'react'
import { Chat } from './types/chat'
import { Storage } from './types/storage'
import { cn } from '@/lib/utils'
import { ChatList } from './components/ChatList'
import { ChatWindow } from './components/ChatWindow'
import { StorageList } from './components/StorageList'
import { StorageView } from './components/StorageView'
import { useChatList } from './hooks/useChatList'
import { useStorageList } from './hooks/useStorageList'
import { MessageCircle, Database } from 'lucide-react'

export function ChatInterface() {
  const {
    chats,
    currentChat,
    isLoading: isChatsLoading,
    error: chatsError,
    createChat,
    refreshChats,
  } = useChatList()

  const {
    storages,
    files,
    currentStorage,
    isLoading: isStoragesLoading,
    error: storagesError,
    addStorage,
    renameStorage,
    loadStorageFiles,
  } = useStorageList()

  const [activeSection, setActiveSection] = useState<'chats' | 'storages'>('chats')

  const handleStorageSelect = async (storageId: number) => {
    try {
      await loadStorageFiles(storageId)
    } catch (err) {
      console.error('Error selecting storage:', err)
    }
  }

  const handleSectionChange = (section: 'chats' | 'storages') => {
    setActiveSection(section)
    if (section === 'chats') {
      refreshChats()
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex-none w-64 border-r">
        <div className="flex-none p-4 border-b">
          <div className="flex gap-2">
            <button
              onClick={() => handleSectionChange('chats')}
              className={cn(
                'flex-1 p-2 text-sm rounded-lg transition-colors',
                activeSection === 'chats'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
              )}
            >
              <MessageCircle className="h-4 w-4 mx-auto" />
            </button>
            <button
              onClick={() => handleSectionChange('storages')}
              className={cn(
                'flex-1 p-2 text-sm rounded-lg transition-colors',
                activeSection === 'storages'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
              )}
            >
              <Database className="h-4 w-4 mx-auto" />
            </button>
          </div>
        </div>

        {activeSection === 'chats' && (
          <ChatList
            chats={chats}
            currentChat={currentChat}
            isLoading={isChatsLoading}
            error={chatsError}
            onChatCreate={createChat}
          />
        )}

        {activeSection === 'storages' && (
          <StorageList
            storages={storages}
            currentStorage={currentStorage}
            isLoading={isStoragesLoading}
            onStorageSelect={handleStorageSelect}
            onStorageCreate={addStorage}
            onStorageRename={renameStorage}
          />
        )}
      </div>

      <main className="flex-1">
        {activeSection === 'chats' && currentChat && (
          <ChatWindow chat={currentChat} />
        )}

        {activeSection === 'storages' && (
          <div className="h-full">
            {currentStorage ? (
              <StorageView
                storage={currentStorage}
                files={files}
                onFileChange={loadStorageFiles.bind(null, currentStorage.id)}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Выберите хранилище
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
