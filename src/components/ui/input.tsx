import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "atlas-focus flex h-11 w-full rounded-[10px] border border-[hsl(var(--border)/0.45)] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] shadow-sm transition duration-200 placeholder:text-[hsl(var(--muted-2))] focus:border-[hsl(var(--brand))] disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
