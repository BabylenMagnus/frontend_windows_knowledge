"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, Link, Loader2, X } from 'lucide-react'
import { uploadFile, addUrl } from '../services/api'

interface FileUploaderProps {
  storageId: number
  onUploadComplete: () => void
}

export function FileUploader({ storageId, onUploadComplete }: FileUploaderProps) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      await uploadFile(storageId, file)
      onUploadComplete()
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      console.error('Error uploading file:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload file')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedUrl = url.trim()
    
    if (!trimmedUrl) return

    setIsLoading(true)
    setError(null)

    try {
      await addUrl(storageId, trimmedUrl)
      onUploadComplete()
      setUrl('')
    } catch (err) {
      console.error('Error adding URL:', err)
      setError(err instanceof Error ? err.message : 'Не удалось добавить URL')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* File upload */}
      <div>
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
          disabled={isLoading}
        />
        <Button
          variant="outline"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Загрузить файл
            </>
          )}
        </Button>
      </div>

      {/* URL input */}
      <form onSubmit={handleUrlSubmit} className="flex gap-2">
        <Input
          type="url"
          placeholder="Введите URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
        />
        <Button type="submit" variant="outline" disabled={isLoading || !url.trim()}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Link className="h-4 w-4" />
          )}
        </Button>
      </form>

      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-2 rounded-md flex items-center gap-2">
          <span className="flex-1">{error}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 hover:bg-destructive/20"
            onClick={() => setError(null)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  )
}
