import * as SliderPrimitive from '@radix-ui/react-slider'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

function Slider({ className, ...props }: ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn('relative flex w-full touch-none items-center select-none', className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-cream-300">
        <SliderPrimitive.Range className="absolute h-full bg-espresso" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block size-4 rounded-full border border-espresso bg-cream-50 shadow-paper transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel/70" />
    </SliderPrimitive.Root>
  )
}

export { Slider }
