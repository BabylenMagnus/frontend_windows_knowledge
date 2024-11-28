"use client"

import { StorageFile } from '../types/storage'
import { FileIcon, FileText } from 'lucide-react'
import { formatFileSize } from '../utils/format'

interface StorageFilesProps {
  files: StorageFile[]
  isLoading: boolean
  onFileSelect?: (file: StorageFile) => void
}

export function StorageFiles({
  files,
  isLoading,
  onFileSelect,
}: StorageFilesProps) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin">⌛</div>
      </div>
    )
  }

  if (!files.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Нет файлов в хранилище
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="grid grid-cols-[auto,1fr,auto] gap-4 items-center text-sm font-medium text-muted-foreground mb-2">
        <div className="w-8"></div>
        <div>Имя</div>
        <div>Размер</div>
      </div>
      
      {files.map((file) => (
        <div
          key={file.id}
          className="grid grid-cols-[auto,1fr,auto] gap-4 items-center p-2 rounded-lg hover:bg-secondary/50 cursor-pointer"
          onClick={() => onFileSelect?.(file)}
        >
          <div className="w-8">
            {file.type.startsWith('text') ? (
              <FileText className="h-5 w-5" />
            ) : (
              <FileIcon className="h-5 w-5" />
            )}
          </div>
          <div className="truncate">{file.name}</div>
          <div className="text-sm text-muted-foreground">
            {formatFileSize(file.size)}
          </div>
        </div>
      ))}
    </div>
  )
}
