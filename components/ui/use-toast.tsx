"use client"

import * as React from "react"
import { Toast } from "./toast"

interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}

interface ToastContextType {
  toasts: Toast[];
  toast: (options: Omit<Toast, 'id'>) => void;
  dismiss: (toastId: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback((options: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((currentToasts) => [...currentToasts, { id, ...options }])
  }, [])

  const dismiss = React.useCallback((toastId: string) => {
    setToasts((currentToasts) => 
      currentToasts.filter((toast) => toast.id !== toastId)
    )
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  
  return context
}
