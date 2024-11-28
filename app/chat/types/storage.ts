export interface Storage {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface StorageFile {
  id: number
  storage_id: number
  name: string
  type: string
  size: number
  created_at: string
  updated_at: string
  url?: string
}
