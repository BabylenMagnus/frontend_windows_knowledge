"use client"

import { StorageFile } from '../types/storage'
import { Button } from '@/components/ui/button'
import { FileText, Trash2, Loader2 } from 'lucide-react'
import { deleteFile } from '../services/api'
import { useState } from 'react'

interface FileListProps {
  files: StorageFile[]
  storageId: number
  onFileDelete: () => void
}

export function FileList({ files, storageId, onFileDelete }: FileListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (fileId: number) => {
    setDeletingId(fileId)
    setError(null)

    try {
      await deleteFile(storageId, fileId)
      onFileDelete()
    } catch (err) {
      console.error('Error deleting file:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete file')
    } finally {
      setDeletingId(null)
    }
  }

  if (files.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-4">
        Нет файлов в хранилище
      </div>
    )
  }

  return (
    <div className="space-y-2 p-4">
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-2 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50"
        >
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1 truncate">{file.name}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => handleDelete(file.id)}
            disabled={deletingId === file.id}
          >
            {deletingId === file.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      ))}
    </div>
  )
}
