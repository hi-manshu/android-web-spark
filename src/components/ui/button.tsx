import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg md-typescale-label-large font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 md-state-focus",
  {
    variants: {
      variant: {
        default: "bg-md-sys-color-primary text-md-sys-color-on-primary md-elevation-2 md-state-hover md-state-pressed" +
          " hover:bg-md-sys-color-primary/90 transition-all duration-200",
        destructive: "bg-md-sys-color-error text-md-sys-color-on-error md-elevation-2 md-state-hover md-state-pressed" +
          " hover:bg-md-sys-color-error/90 transition-all duration-200",
        outline: "border border-md-sys-color-outline bg-md-sys-color-surface text-md-sys-color-on-surface md-state-hover" +
          " hover:bg-md-sys-color-surface-variant transition-all duration-200",
        secondary: "bg-md-sys-color-secondary text-md-sys-color-on-secondary md-elevation-1 md-state-hover md-state-pressed" +
          " hover:bg-md-sys-color-secondary/90 transition-all duration-200",
        ghost: "text-md-sys-color-on-surface md-state-hover" +
          " hover:bg-md-sys-color-surface-variant transition-all duration-200",
        link: "text-md-sys-color-primary underline-offset-4 hover:underline",
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
