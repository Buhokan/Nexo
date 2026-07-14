import * as React from "react"
import { cn } from "@/utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "green" | "red" | "amber"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "nexo-badge",
        {
          "nexo-badge-primary": variant === "primary",
          "nexo-badge-green": variant === "green",
          "nexo-badge-red": variant === "red",
          "nexo-badge-amber": variant === "amber",
          "bg-[var(--color-surface-2)] text-[var(--color-text)] border border-[var(--color-border)]": variant === "default",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
