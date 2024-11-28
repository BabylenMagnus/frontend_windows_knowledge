"use client"

import { useState } from 'react'
import { ChatList } from './components/ChatList'
import { ChatWindow } from './components/ChatWindow'
import { UploadSection } from './components/UploadSection'
import { useChatList } from './hooks/useChatList'
import { useStorageList } from './hooks/useStorageList'
import { Storage } from './types/storage'

type Section = 'chats' | 'storages'

export function ChatInterface() {
  const [currentSection, setCurrentSection] = useState<Section>('chats')
  
  const {
    chats,
    currentChat,
    isLoading: isChatsLoading,
    error: chatsError,
    createNewChat,
    selectChat,
    refreshChats
  } = useChatList()

  const {
    storages,
    currentStorage,
    isLoading: isStoragesLoading,
    error: storagesError,
    selectStorage,
    refreshStorages
  } = useStorageList()

  console.log('ChatInterface render:', {
    chats,
    currentChat,
    currentSection,
    isChatsLoading
  }) // Debug log

  const handleSectionChange = (section: Section) => {
    setCurrentSection(section)
    if (section === 'chats') {
      refreshChats()
    } else {
      refreshStorages()
    }
  }

  const handleStorageSelect = (storage: Storage) => {
    selectStorage(storage)
  }

  return (
    <div className="flex h-screen bg-background">
      <ChatList
        chats={chats}
        currentChat={currentChat}
        onCreateChat={createNewChat}
        onSelectChat={selectChat}
        storages={storages}
        currentStorage={currentStorage}
        onSelectStorage={handleStorageSelect}
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
        isLoading={currentSection === 'chats' ? isChatsLoading : isStoragesLoading}
        error={currentSection === 'chats' ? chatsError : storagesError}
      />

      {currentSection === 'chats' ? (
        <ChatWindow currentChat={currentChat} />
      ) : (
        <UploadSection
          onFileUpload={(file) => {
            console.log('File upload:', file)
            // Implement file upload logic
          }}
          onLinkAdd={(url) => {
            console.log('Link add:', url)
            // Implement link add logic
          }}
        />
      )}
    </div>
  )
}
