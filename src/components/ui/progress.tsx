import * as ProgressPrimitive from '@radix-ui/react-progress'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

function Progress({
  className,
  value,
  ...props
}: ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      className={cn('relative h-1.5 w-full overflow-hidden rounded-full bg-cream-300', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full bg-espresso transition-transform duration-300"
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
