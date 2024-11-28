"use client"

import { useState, useEffect } from 'react'
import { Storage, StorageFile } from '../types/storage'
import { fetchStorages, createStorage, updateStorage, fetchStorageFiles } from '../services/api'

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
      console.error('Error loading storages:', err)
      setError(err instanceof Error ? err.message : 'Failed to load storages')
    } finally {
      setIsLoading(false)
    }
  }

  const addStorage = async (name: string, description?: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const newStorage = await createStorage(name, description)
      setStorages(prev => [...prev, newStorage])
      return newStorage
    } catch (err) {
      console.error('Error creating storage:', err)
      setError(err instanceof Error ? err.message : 'Failed to create storage')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const renameStorage = async (storageId: number, newName: string, description?: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedStorage = await updateStorage(storageId, newName, description)
      setStorages(prev => prev.map(storage => 
        storage.id === storageId ? updatedStorage : storage
      ))
      if (currentStorage?.id === storageId) {
        setCurrentStorage(updatedStorage)
      }
      return updatedStorage
    } catch (err) {
      console.error('Error updating storage:', err)
      setError(err instanceof Error ? err.message : 'Failed to update storage')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const loadStorageFiles = async (storageId: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchStorageFiles(storageId)
      setFiles(data)
      const storage = storages.find(s => s.id === storageId) || null
      setCurrentStorage(storage)
    } catch (err) {
      console.error('Error loading storage files:', err)
      setError(err instanceof Error ? err.message : 'Failed to load storage files')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadStorages()
  }, [])

  return {
    storages,
    currentStorage,
    files,
    isLoading,
    error,
    addStorage,
    renameStorage,
    loadStorageFiles,
    refreshStorages: loadStorages,
  }
}
