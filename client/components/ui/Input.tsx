import { cn } from "@/utils/function"
import React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return <input className={cn("input input-sm", className)} ref={ref} {...props} />
  }
)
Input.displayName = "Input"

export interface InputWithErrorMessageProps extends InputProps {
  wrapperClassName?: string
  message?: string
}
export const InputWithErrorMessage = React.forwardRef<HTMLInputElement, InputWithErrorMessageProps>(
  ({ wrapperClassName, className, message, ...props }, ref) => {
    return (
      <div className={cn("min-h-16 w-full flex flex-col items-start", wrapperClassName)}>
        <input className={cn("input input-primary", className)} ref={ref} {...props} />
        <p className="text-red-500 text-xs mt-0.5 text-wrap">{message}</p>
      </div>
    )
  }
)
InputWithErrorMessage.displayName = "InputWithErrorMessage"
