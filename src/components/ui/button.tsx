import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel/70 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-espresso text-cream-50 shadow-paper hover:bg-ink hover:shadow-lift',
        secondary:
          'border border-cream-300 bg-cream-50 text-espresso hover:border-umber hover:bg-cream-100',
        ghost: 'text-cocoa hover:bg-cream-200/70 hover:text-ink',
        brass:
          'bg-brass text-ink shadow-paper hover:brightness-110 hover:shadow-lift',
      },
      size: {
        sm: 'h-9 px-3.5',
        md: 'h-11 px-5',
        lg: 'h-12 px-6 text-[15px]',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
}

export { Button, buttonVariants }
