"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Brain, Cloud, Edit2, MoreHorizontal, Plus, RefreshCw, Search, Settings, Trash2, Copy, ChevronRight } from 'lucide-react'
import { Input } from "@/components/ui/input"
import axios from "axios"

interface FileUpload {
  id: string
  name: string
  type: string
  progress: number
  size: string
  status?: 'uploading' | 'completed' | 'error'
}

export default function UploadPage() {
  const [files, setFiles] = React.useState<FileUpload[]>([])
  const [isDragging, setIsDragging] = React.useState(false)
  const [url, setUrl] = React.useState("")

  const uploadFile = async (file: File, fileId: string) => {
    console.log('Attempting to upload file:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Create FormData with explicit typing
    const formData = new FormData()
    formData.append('file', file, file.name)  // Explicitly include filename
    formData.append('description', `Upload of ${file.name}`)
    
    try {
      // Try different ways of sending storage_id
      const response = await axios.post('http://localhost:8040/upload-pdf', formData, {
        params: {
          storage_id: 1  // Send as query parameter
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: [data => {
          // Log exact form data being sent
          for (let [key, value] of data.entries()) {
            console.log(`Form Data - ${key}:`, value)
          }
          return data
        }],
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setFiles(prev => prev.map(f => 
              f.id === fileId ? { ...f, progress, status: 'uploading' } : f
            ))
          }
        }
      })

      console.log('Upload successful:', response.data)

      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, progress: 100, status: 'completed' } : f
      ))
    } catch (error) {
      console.error('Upload failed:', error)
      
      // More detailed error logging
      if (axios.isAxiosError(error)) {
        console.error('Error details:', {
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
          config: error.config
        })
      }

      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'error' } : f
      ))
    }
  }

  const onDrop = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    
    // Filter for PDF files and check file size
    const validFiles = droppedFiles.filter(file => {
      const isPDF = file.type === 'application/pdf'
      const isUnder50MB = file.size <= 50 * 1024 * 1024 // 50MB

      if (!isPDF) {
        alert(`${file.name} is not a PDF file and will be skipped.`)
      }

      if (!isUnder50MB) {
        alert(`${file.name} exceeds 50MB and will be skipped.`)
      }

      return isPDF && isUnder50MB
    })

    const newFiles: FileUpload[] = validFiles.map((file, index) => ({
      id: Date.now().toString() + index,
      name: file.name,
      type: 'PDF',
      progress: 0,
      size: formatFileSize(file.size),
      status: 'uploading'
    }))

    setFiles(prev => [...prev, ...newFiles])

    validFiles.forEach((file, index) => {
      uploadFile(file, newFiles[index].id)
    })
  }, [])

  const onDragOver = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      
      // Filter for PDF files and check file size
      const validFiles = selectedFiles.filter(file => {
        const isPDF = file.type === 'application/pdf'
        const isUnder50MB = file.size <= 50 * 1024 * 1024 // 50MB

        if (!isPDF) {
          alert(`${file.name} is not a PDF file and will be skipped.`)
        }

        if (!isUnder50MB) {
          alert(`${file.name} exceeds 50MB and will be skipped.`)
        }

        return isPDF && isUnder50MB
      })
      
      const newFiles: FileUpload[] = validFiles.map((file, index) => ({
        id: Date.now().toString() + index,
        name: file.name,
        type: 'PDF',
        progress: 0,
        size: formatFileSize(file.size),
        status: 'uploading'
      }))

      setFiles(prev => [...prev, ...newFiles])

      validFiles.forEach((file, index) => {
        uploadFile(file, newFiles[index].id)
      })
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - reused from chat interface */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <Brain className="w-6 h-6" />
          <h1 className="font-semibold">Мои чаты</h1>
          <Button size="icon" variant="ghost" className="ml-auto rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200">
            <Plus className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Upload Area */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4 flex items-center justify-between">
          <h2 className="font-semibold">Upload Your File</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="rounded-full bg-blue-50 text-blue-600">
              <Cloud className="w-4 h-4 mr-2" />
              Загрузка
            </Button>
            <Button variant="ghost" className="rounded-full">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Загруженные документы
            </Button>
            <Button size="icon" variant="ghost">
              <Search className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 p-8">
          {/* Upload Area */}
          <div 
            className={cn(
              "border-2 border-dashed border-blue-200 rounded-lg p-12 bg-blue-50/50 transition-colors",
              isDragging && "border-blue-500 bg-blue-100/50"
            )}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Cloud className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">
                {isDragging ? "Drop files here" : "Drag and drop your files"}
              </h3>
              <p className="text-lg">Or</p>
              <Button 
                className="bg-blue-200 text-blue-700 hover:bg-blue-300"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse files
              </Button>
            </div>
          </div>

          {/* Add URL input field */}
          <div className="mt-8 flex gap-4">
            <Input
              placeholder="Enter file URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={() => {
                // Handle URL upload here
                if (url.trim()) {
                  const fileName = url.split('/').pop() || 'downloaded-file'
                  const newFile = {
                    id: Date.now().toString(),
                    name: fileName,
                    type: 'URL',
                    progress: 0,
                    size: 'N/A',
                    status: 'uploading'
                  }
                  setFiles(prev => [...prev, newFile])
                  
                  // Upload URL to backend
                  axios.post('http://localhost:8040/add-url', { url: url.trim() })
                    .then(response => {
                      console.log('URL upload successful:', response.data)
                      setFiles(prev => prev.map(f => 
                        f.id === newFile.id 
                          ? { ...f, progress: 100, status: 'completed' } 
                          : f
                      ))
                    })
                    .catch(error => {
                      console.error('URL upload failed:', error)
                      setFiles(prev => prev.map(f => 
                        f.id === newFile.id 
                          ? { ...f, status: 'error' } 
                          : f
                      ))
                    })

                  setUrl('')
                }
              }}
            >
              Upload from URL
            </Button>
          </div>

          {/* File List */}
          <div className="mt-8 space-y-4">
            {files.map((file) => (
              <div key={file.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-sm font-medium">
                  {file.type}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{file.name}</h4>
                      <p className="text-sm text-gray-500">
                        {file.size} • {file.status === 'error' ? 
                          <span className="text-red-500">Upload failed</span> : 
                          file.status === 'completed' ? 
                          <span className="text-green-500">Completed</span> : 
                          'Uploading...'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Progress 
                    value={file.progress} 
                    className={cn(
                      "h-2",
                      file.status === 'error' && "bg-red-200",
                      file.status === 'completed' && "bg-green-200"
                    )} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        multiple
      />
    </div>
  )
}
