"use client"

import * as React from "react"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, children, value, onValueChange, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        role="radiogroup" 
        className={cn("flex space-x-2", className)} 
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              ...(child.props as object),
              checked: child.props.value === value,
              onSelect: () => onValueChange?.(child.props.value)
            });
          }
          return child;
        })}
      </div>
    );
  }
);
RadioGroup.displayName = "RadioGroup"

interface RadioGroupItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string;
  checked?: boolean;
  onSelect?: () => void;
}

const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ className, children, value, checked, onSelect, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={checked}
        className={cn(
          "flex items-center space-x-2 p-2 rounded-md transition-colors",
          checked 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted hover:bg-muted-foreground/10",
          className
        )}
        onClick={onSelect}
        {...props}
      >
        <div 
          className={cn(
            "w-4 h-4 rounded-full border-2 flex items-center justify-center",
            checked 
              ? "border-primary-foreground" 
              : "border-muted-foreground"
          )}
        >
          {checked && <Circle className="w-2 h-2 fill-current" />}
        </div>
        {children}
      </button>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
