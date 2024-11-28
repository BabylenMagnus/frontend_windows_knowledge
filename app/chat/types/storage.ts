export interface StorageCreate {
  name: string;
  description?: string;
}

export interface StorageUpdate {
  name: string;
  description?: string;
}

export interface Storage {
  id: number
  name: string
  description?: string
  nickname: string
  created_at: string
  updated_at: string
}

export interface StorageFile {
  id: number
  name: string
  type: string
  description?: string
  created_at: string
  updated_at: string
  url?: string
  size?: number
}
