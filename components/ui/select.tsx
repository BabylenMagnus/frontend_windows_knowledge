"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ className, children, value, onValueChange, open, onOpenChange, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleOpenToggle = () => {
      const newOpenState = !isOpen;
      setIsOpen(newOpenState);
      onOpenChange?.(newOpenState);
    };

    return (
      <div 
        ref={ref} 
        className={cn("relative w-full", className)}
        {...props}
      >
        <div 
          role="combobox" 
          aria-expanded={isOpen}
          onClick={handleOpenToggle}
          className="flex items-center justify-between w-full border rounded-md px-3 py-2 cursor-pointer"
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === SelectTrigger) {
              return React.cloneElement(child, {
                ...(child.props as object),
                value,
              });
            }
            return null;
          })}
        </div>
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 border rounded-md shadow-lg bg-white">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child) && child.type === SelectContent) {
                return React.cloneElement(child, {
                  ...(child.props as object),
                  onItemSelect: (selectedValue: string) => {
                    onValueChange?.(selectedValue);
                    setIsOpen(false);
                  },
                });
              }
              return null;
            })}
          </div>
        )}
      </div>
    );
  }
);
Select.displayName = "Select"

interface SelectTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
}

const SelectTrigger = React.forwardRef<HTMLDivElement, SelectTriggerProps>(
  ({ className, children, value, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn("flex items-center justify-between", className)}
        {...props}
      >
        <div className="flex-grow">
          {value || children}
        </div>
        <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
      </div>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger"

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  onItemSelect?: (value: string) => void;
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, onItemSelect, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn("", className)}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SelectItem) {
            return React.cloneElement(child, {
              ...(child.props as object),
              onClick: () => onItemSelect?.(child.props.value),
            });
          }
          return child;
        })}
      </div>
    );
  }
);
SelectContent.displayName = "SelectContent"

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onClick?: () => void;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, onClick, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        role="option"
        onClick={onClick}
        className={cn(
          "px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SelectItem.displayName = "SelectItem"

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, placeholder, children, ...props }, ref) => {
    return (
      <span 
        ref={ref} 
        className={cn("", className)}
        {...props}
      >
        {children || placeholder}
      </span>
    );
  }
);
SelectValue.displayName = "SelectValue"

export { 
  Select, 
  SelectTrigger, 
  SelectContent, 
  SelectItem, 
  SelectValue 
}
