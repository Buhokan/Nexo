import * as React from "react"
import { cn } from "@/utils/cn"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "nexo-btn",
          {
            "nexo-btn-primary": variant === "primary",
            "nexo-btn-secondary": variant === "secondary",
            "nexo-btn-ghost": variant === "ghost",
            "nexo-btn-danger": variant === "danger",
            "px-3 py-1.5 text-xs": size === "sm",
            "px-6 py-3 text-base": size === "lg",
            "w-10 h-10 p-0 rounded-xl": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
