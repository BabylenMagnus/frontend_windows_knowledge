"use client"

import { useState } from 'react'
import { Storage } from '../types/storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil, Plus, Folder } from 'lucide-react'

interface StorageListProps {
  storages: Storage[]
  currentStorage: Storage | null
  isLoading: boolean
  onStorageSelect: (storageId: number) => void
  onStorageCreate: (name: string) => void
  onStorageRename: (storageId: number, newName: string) => void
}

export function StorageList({
  storages,
  currentStorage,
  isLoading,
  onStorageSelect,
  onStorageCreate,
  onStorageRename,
}: StorageListProps) {
  const [newStorageName, setNewStorageName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')

  const handleCreateStorage = () => {
    if (newStorageName.trim()) {
      onStorageCreate(newStorageName.trim())
      setNewStorageName('')
    }
  }

  const handleRenameStorage = (storageId: number) => {
    if (editName.trim()) {
      onStorageRename(storageId, editName.trim())
      setEditingId(null)
      setEditName('')
    }
  }

  const startEditing = (storage: Storage) => {
    setEditingId(storage.id)
    setEditName(storage.name)
  }

  return (
    <div className="w-64 h-full border-r bg-background p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Новое хранилище"
          value={newStorageName}
          onChange={(e) => setNewStorageName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleCreateStorage()}
        />
        <Button
          size="icon"
          variant="outline"
          onClick={handleCreateStorage}
          disabled={!newStorageName.trim() || isLoading}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        {storages.map((storage) => (
          <div
            key={storage.id}
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
              currentStorage?.id === storage.id
                ? 'bg-secondary'
                : 'hover:bg-secondary/50'
            }`}
          >
            {editingId === storage.id ? (
              <div className="flex-1 flex items-center gap-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleRenameStorage(storage.id)}
                  onBlur={() => setEditingId(null)}
                  autoFocus
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRenameStorage(storage.id)}
                  disabled={!editName.trim() || isLoading}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <div
                  className="flex-1 flex items-center gap-2"
                  onClick={() => onStorageSelect(storage.id)}
                >
                  <Folder className="h-4 w-4" />
                  <span className="truncate">{storage.name}</span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => startEditing(storage)}
                  className="opacity-0 group-hover:opacity-100"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
