"use client"

import { useState } from 'react'
import { Chat } from './types/chat'
import { Storage } from './types/storage'
import { ChatList } from './components/ChatList'
import { ChatWindow } from './components/ChatWindow'
import { StorageList } from './components/StorageList'
import { StorageFiles } from './components/StorageFiles'
import { useChatList } from './hooks/useChatList'
import { useStorageList } from './hooks/useStorageList'
import { MessageCircle, Database } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ChatInterface() {
  const {
    chats,
    currentChat,
    isLoading: isChatsLoading,
    error: chatsError,
    createChat,
    selectChat,
    refreshChats,
  } = useChatList()

  const {
    storages,
    currentStorage,
    files,
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
      <div className="w-64 flex flex-col flex-none border-r">
        <div className="flex-none p-4 border-b">
          <div className="flex gap-2">
            <button
              onClick={() => handleSectionChange('chats')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md',
                activeSection === 'chats'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
            >
              <MessageCircle className="h-4 w-4" />
              Чаты
            </button>
            <button
              onClick={() => handleSectionChange('storages')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md',
                activeSection === 'storages'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
            >
              <Database className="h-4 w-4" />
              Хранилища
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeSection === 'chats' ? (
            <ChatList
              chats={chats}
              currentChat={currentChat}
              isLoading={isChatsLoading}
              onChatCreate={createChat}
              onChatSelect={selectChat}
              error={chatsError}
            />
          ) : (
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
      </div>

      <main className="flex-1 flex flex-col min-w-0 h-full">
        {activeSection === 'chats' ? (
          currentChat ? (
            <ChatWindow chat={currentChat} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Выберите чат для начала общения
            </div>
          )
        ) : (
          <div className="flex-1 flex flex-col">
            {storagesError && (
              <div className="p-4 text-sm text-destructive bg-destructive/10">
                {storagesError}
              </div>
            )}
            
            {currentStorage && (
              <div className="flex-none border-b p-4">
                <h2 className="font-semibold">{currentStorage.name}</h2>
                {currentStorage.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentStorage.description}
                  </p>
                )}
              </div>
            )}

            <StorageFiles
              files={files}
              isLoading={isStoragesLoading}
              onFileSelect={(file) => {
                console.log('Selected file:', file)
                // Handle file selection
              }}
            />
          </div>
        )}
      </main>
    </div>
  )
}
