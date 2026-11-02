import * as SwitchPrimitive from '@radix-ui/react-switch'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-cream-300 bg-cream-200 transition-colors data-[state=checked]:border-espresso data-[state=checked]:bg-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel/70',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-5 translate-x-0.5 rounded-full bg-cream-50 shadow-paper transition-transform data-[state=checked]:translate-x-[1.35rem]" />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
