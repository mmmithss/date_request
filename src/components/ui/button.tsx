import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "romantic"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-95"

    const variants: Record<string, string> = {
      default: "bg-pink-600 text-white shadow-md hover:bg-pink-700 hover:shadow-lg",
      romantic:
        "bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white font-semibold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:brightness-105 active:scale-95",
      destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
      outline:
        "border border-pink-200 bg-white/80 backdrop-blur-sm text-pink-700 hover:bg-pink-50 hover:text-pink-800 shadow-sm",
      secondary:
        "bg-pink-100 text-pink-900 hover:bg-pink-200 shadow-sm",
      ghost: "text-pink-700 hover:bg-pink-100/50",
      link: "text-pink-600 underline-offset-4 hover:underline",
    }

    const sizes: Record<string, string> = {
      default: "h-11 px-6 py-2.5 text-base",
      sm: "h-9 rounded-lg px-3 text-xs",
      lg: "h-14 rounded-2xl px-8 text-lg font-bold",
      icon: "h-10 w-10",
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
