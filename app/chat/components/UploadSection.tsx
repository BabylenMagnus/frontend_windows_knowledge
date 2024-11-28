"use client"

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface UploadSectionProps {
  onFileUpload?: (file: File) => void
  onLinkAdd?: (url: string) => void
}

export function UploadSection({ onFileUpload, onLinkAdd }: UploadSectionProps) {
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && onFileUpload) {
      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          onFileUpload(file)
          setUploadProgress(0)
        }
      }, 100)
    }
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  })

  return (
    <div className="p-4 space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-8 w-8 mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {isDragActive
            ? 'Перетащите файл сюда'
            : 'Перетащите файл сюда или нажмите для выбора'}
        </p>
      </div>

      {uploadProgress > 0 && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-sm text-muted-foreground text-center">
            Загрузка: {uploadProgress}%
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            const input = document.createElement('input')
            input.type = 'file'
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0]
              if (file && onFileUpload) {
                onFileUpload(file)
              }
            }
            input.click()
          }}
        >
          <File className="mr-2 h-4 w-4" />
          Выбрать файл
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            const url = window.prompt('Введите URL')
            if (url && onLinkAdd) {
              onLinkAdd(url)
            }
          }}
        >
          <LinkIcon className="mr-2 h-4 w-4" />
          Добавить ссылку
        </Button>
      </div>
    </div>
  )
}
