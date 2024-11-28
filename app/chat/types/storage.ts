export interface StorageCreate {
  name: string;
  description?: string;
}

export interface StorageUpdate {
  name: string;
  description?: string;
}

export interface Storage {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface StorageFile {
  id: number;
  storage_id: number;
  name: string;
  path: string;
  size: number;
  type: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}
