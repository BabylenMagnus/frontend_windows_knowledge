"use client"

import { useState, useEffect } from 'react'
import { Storage, StorageFile } from '../types/storage'
import { fetchStorages } from '../services/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8040'

// Mock data for testing
const mockStorages: Storage[] = [
  {
    id: 1,
    name: 'Личные документы',
    description: 'Мои личные документы и заметки',
    nickname: 'personal',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Рабочие файлы',
    description: 'Документы по работе и проектам',
    nickname: 'work',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockFiles: StorageFile[] = [
  {
    id: 1,
    name: 'document1.pdf',
    type: 'pdf',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'image1.jpg',
    type: 'image',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function useStorageList() {
  const [storages, setStorages] = useState<Storage[]>([])
  const [currentStorage, setCurrentStorage] = useState<Storage | null>(null)
  const [files, setFiles] = useState<StorageFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStorages = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchStorages()
      setStorages(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load storages')
      console.error('Error loading storages:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStorageFiles = async (storageId: number) => {
    try {
      setIsLoading(true)
      // В реальном приложении здесь будет API запрос
      setFiles(mockFiles)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch storage files')
    } finally {
      setIsLoading(false)
    }
  }

  const selectStorage = async (storage: Storage) => {
    setCurrentStorage(storage)
    await fetchStorageFiles(storage.id)
  }

  // Initial load
  useEffect(() => {
    loadStorages()
  }, [])

  return {
    storages,
    currentStorage,
    files,
    isLoading,
    error,
    selectStorage,
    refreshStorages: loadStorages,
    refreshFiles: () => currentStorage && fetchStorageFiles(currentStorage.id)
  }
}
