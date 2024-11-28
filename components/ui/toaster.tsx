"use client"

import { Toast, ToastClose, ToastDescription, ToastTitle } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-[100] m-4 flex flex-col gap-2 md:max-w-[420px]">
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast 
          key={id} 
          id={id}
          title={title}
          description={description}
          {...props}
        >
          {action}
        </Toast>
      ))}
    </div>
  )
}
