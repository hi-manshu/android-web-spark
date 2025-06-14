import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg md-typescale-label-large font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 md-state-focus",
  {
    variants: {
      variant: {
        default: "md-elevation-1 md-state-hover md-state-pressed" + 
          " bg-blue-600 text-white" +
          " hover:bg-blue-700",
        destructive: "md-elevation-1 md-state-hover md-state-pressed" +
          " bg-red-600 text-white" +
          " hover:bg-red-700",
        outline: "border border-gray-300 dark:border-gray-600 md-surface md-state-hover" +
          " text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
        secondary: "md-elevation-1 md-state-hover md-state-pressed" +
          " bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100" +
          " hover:bg-gray-200 dark:hover:bg-gray-700",
        ghost: "md-state-hover text-gray-700 dark:text-gray-300" +
          " hover:bg-gray-100 dark:hover:bg-gray-800",
        link: "text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-lg px-4",
        lg: "h-14 rounded-lg px-8",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
