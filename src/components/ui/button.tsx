
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full md-typescale-label-large font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 md-state-focus",
  {
    variants: {
      variant: {
        default: "md-elevation-1 md-state-hover md-state-pressed" + 
          " bg-[hsl(var(--md-sys-color-primary))] text-[hsl(var(--md-sys-color-on-primary))]" +
          " hover:bg-[hsl(var(--md-sys-color-primary)/0.9)]",
        destructive: "md-elevation-1 md-state-hover md-state-pressed" +
          " bg-[hsl(var(--md-sys-color-error))] text-[hsl(var(--md-sys-color-on-error))]" +
          " hover:bg-[hsl(var(--md-sys-color-error)/0.9)]",
        outline: "border border-[hsl(var(--md-sys-color-outline))] md-surface md-state-hover" +
          " text-[hsl(var(--md-sys-color-on-surface))] hover:bg-[hsl(var(--md-sys-color-on-surface)/0.08)]",
        secondary: "md-elevation-1 md-state-hover md-state-pressed" +
          " bg-[hsl(var(--md-sys-color-secondary-container))] text-[hsl(var(--md-sys-color-on-secondary-container))]" +
          " hover:bg-[hsl(var(--md-sys-color-secondary-container)/0.9)]",
        ghost: "md-state-hover text-[hsl(var(--md-sys-color-on-surface))]" +
          " hover:bg-[hsl(var(--md-sys-color-on-surface)/0.08)]",
        link: "text-[hsl(var(--md-sys-color-primary))] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-full px-4",
        lg: "h-14 rounded-full px-8",
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
