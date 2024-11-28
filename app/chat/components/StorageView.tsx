"use client"

import { Storage, StorageFile } from '../types/storage'
import { FileUploader } from './FileUploader'
import { FileList } from './FileList'

interface StorageViewProps {
  storage: Storage
  files: StorageFile[]
  onFileChange: () => void
}

export function StorageView({ storage, files, onFileChange }: StorageViewProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-none border-b p-4">
        <h2 className="font-semibold">{storage.name}</h2>
        {storage.description && (
          <p className="text-sm text-muted-foreground mt-1">{storage.description}</p>
        )}
      </div>

      <div className="flex-none">
        <FileUploader storageId={storage.id} onUploadComplete={onFileChange} />
      </div>

      <div className="flex-1 overflow-auto">
        <FileList
          files={files}
          storageId={storage.id}
          onFileDelete={onFileChange}
        />
      </div>
    </div>
  )
}
