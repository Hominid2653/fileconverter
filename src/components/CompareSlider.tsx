import * as SliderPrimitive from '@radix-ui/react-slider'
import { useState } from 'react'

type CompareSliderProps = {
  beforeSrc: string
  afterSrc: string
  afterLabel: string
}

export function CompareSlider({ beforeSrc, afterSrc, afterLabel }: CompareSliderProps) {
  const [value, setValue] = useState(62)

  return (
    <div className="relative overflow-hidden rounded-[1.4rem] bg-cream-200">
      <div className="checkerboard relative aspect-[4/3] w-full">
        <img
          src={afterSrc}
          alt={afterLabel}
          className="absolute inset-0 size-full object-contain"
        />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          <img src={beforeSrc} alt="Original" className="absolute inset-0 size-full object-contain" />
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-espresso/70"
          style={{ left: `${value}%` }}
        >
          <span className="absolute top-1/2 left-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-espresso bg-cream-50 text-espresso shadow-paper">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
              <path d="M8 7 4 12l4 5M16 7l4 5-4 5" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
        </div>
      </div>
      <SliderPrimitive.Root
        value={[value]}
        onValueChange={([next]) => setValue(next ?? 62)}
        max={100}
        step={1}
        className="absolute inset-0 cursor-ew-resize"
        aria-label="Compare original and result"
      >
        <SliderPrimitive.Track className="relative h-full w-full">
          <SliderPrimitive.Range className="absolute h-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="size-0 border-0 opacity-0" />
      </SliderPrimitive.Root>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between px-4 py-3 text-[10px] tracking-[0.18em] text-cream-50 uppercase">
        <span className="rounded-full bg-ink/55 px-2 py-1">Original</span>
        <span className="rounded-full bg-ink/55 px-2 py-1">{afterLabel}</span>
      </div>
    </div>
  )
}
