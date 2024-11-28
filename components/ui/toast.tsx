"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

interface ToastProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {
  id?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  onClose?: () => void;
}

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, id, title, description, action, onClose, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        id={id}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        <div className="grid gap-1">
          {title && <ToastTitle>{title}</ToastTitle>}
          {description && <ToastDescription>{description}</ToastDescription>}
          {children}
        </div>
        {action}
        <ToastClose onClose={onClose} />
      </div>
    )
  }
)
Toast.displayName = "Toast"

interface ToastTitleProps extends React.HTMLAttributes<HTMLDivElement> {}

const ToastTitle = React.forwardRef<HTMLDivElement, ToastTitleProps>(
  ({ className, children, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("text-sm font-semibold", className)} 
      {...props}
    >
      {children}
    </div>
  )
)
ToastTitle.displayName = "ToastTitle"

interface ToastDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}

const ToastDescription = React.forwardRef<HTMLDivElement, ToastDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("text-sm opacity-90", className)} 
      {...props}
    >
      {children}
    </div>
  )
)
ToastDescription.displayName = "ToastDescription"

interface ToastCloseProps extends React.HTMLAttributes<HTMLButtonElement> {
  onClose?: () => void;
}

const ToastClose = React.forwardRef<HTMLButtonElement, ToastCloseProps>(
  ({ className, onClose, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none group-hover:opacity-100",
        className
      )}
      onClick={onClose}
      {...props}
    >
      <X className="h-4 w-4" />
    </button>
  )
)
ToastClose.displayName = "ToastClose"

interface ToastActionProps extends React.HTMLAttributes<HTMLDivElement> {}

const ToastAction = React.forwardRef<HTMLDivElement, ToastActionProps>(
  ({ className, children, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  )
)
ToastAction.displayName = "ToastAction"

export { 
  Toast, 
  ToastTitle, 
  ToastDescription, 
  ToastClose, 
  ToastAction 
}
