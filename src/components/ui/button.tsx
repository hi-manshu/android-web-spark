import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg md-typescale-label-large font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 md-state-focus",
  {
    variants: {
      variant: {
        default: "bg-md-sys-color-primary text-md-sys-color-on-primary border border-md-sys-color-primary" +
          " hover:bg-md-sys-color-on-surface hover:text-md-sys-color-surface transition-all duration-200",
        destructive: "bg-md-sys-color-error text-md-sys-color-on-error" +
          " hover:bg-md-sys-color-error/90 transition-all duration-200",
        outline: "border border-md-sys-color-outline bg-md-sys-color-surface text-md-sys-color-on-surface" +
          " hover:bg-md-sys-color-surface-variant transition-all duration-200",
        secondary: "bg-md-sys-color-secondary text-md-sys-color-on-secondary border border-md-sys-color-outline" +
          " hover:bg-md-sys-color-surface-variant transition-all duration-200",
        ghost: "text-md-sys-color-on-surface hover:bg-md-sys-color-surface-variant transition-all duration-200",
        link: "text-md-sys-color-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
