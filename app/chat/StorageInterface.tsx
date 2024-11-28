"use client"

import { useStorageList } from './hooks/useStorageList'
import { StorageList } from './components/StorageList'
import { StorageFiles } from './components/StorageFiles'

export function StorageInterface() {
  const {
    storages,
    currentStorage,
    files,
    isLoading,
    error,
    addStorage,
    renameStorage,
    loadStorageFiles,
  } = useStorageList()

  const handleStorageSelect = (storageId: number) => {
    loadStorageFiles(storageId)
  }

  return (
    <div className="flex h-full">
      <StorageList
        storages={storages}
        currentStorage={currentStorage}
        isLoading={isLoading}
        onStorageSelect={handleStorageSelect}
        onStorageCreate={addStorage}
        onStorageRename={renameStorage}
      />
      
      <div className="flex-1 flex flex-col">
        {error && (
          <div className="p-4 text-sm text-destructive bg-destructive/10">
            {error}
          </div>
        )}
        
        {currentStorage && (
          <div className="border-b p-4">
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
          isLoading={isLoading}
          onFileSelect={(file) => {
            console.log('Selected file:', file)
            // Здесь можно добавить обработку выбора файла
          }}
        />
      </div>
    </div>
  )
}
