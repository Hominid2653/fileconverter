import { ImagePlus } from 'lucide-react'
import { useCallback, useRef, useState, type DragEvent } from 'react'
import { createSampleStillLife } from '@/lib/sample'
import { cn } from '@/lib/utils'

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/avif,image/bmp,image/svg+xml'

type DropZoneProps = {
  onFile: (file: File) => void
}

export function DropZone({ onFile }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)

  const take = useCallback(
    (file?: File) => {
      if (!file) return
      if (!file.type.startsWith('image/')) return
      onFile(file)
    },
    [onFile],
  )

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    setOver(false)
    take(event.dataTransfer.files[0])
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-10 text-center">
        <p className="mb-3 text-[11px] tracking-[0.28em] text-cocoa uppercase">
          Convert · compress · cut out
        </p>
        <h1 className="font-display text-4xl leading-[1.1] text-ink sm:text-5xl">
          Drop a photograph.
          <em className="mt-1 block font-display text-umber italic">Leave with a lighter one.</em>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-cocoa">
          JPG, PNG, or WebP in. WebP, PNG, JPEG, or a clean cutout out. Everything runs on this
          page — nothing is uploaded.
        </p>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={cn(
          'group relative flex min-h-[280px] w-full flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-dashed px-6 py-12 text-center transition duration-300',
          over
            ? 'border-espresso bg-cream-200 shadow-lift'
            : 'border-cream-400/80 bg-cream-100/80 shadow-paper hover:border-umber hover:bg-cream-100',
        )}
      >
        <PolaroidStack />
        <div className="relative mt-6 flex size-12 items-center justify-center rounded-full bg-espresso text-cream-50 shadow-paper transition group-hover:scale-105">
          <ImagePlus className="size-5" />
        </div>
        <p className="relative mt-4 font-display text-2xl text-ink">Drop an image here</p>
        <p className="relative mt-1.5 text-sm text-cocoa">or click to browse · paste works too</p>
        <p className="relative mt-6 text-[11px] tracking-[0.2em] text-cream-400 uppercase">
          JPG · PNG · WebP · AVIF · GIF
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(event) => {
            take(event.target.files?.[0])
            event.target.value = ''
          }}
        />
      </button>
      <div className="mt-4 text-center">
        <button
          type="button"
          className="text-sm text-umber underline decoration-cream-400 underline-offset-4 hover:text-espresso"
          onClick={() => void createSampleStillLife().then(onFile)}
        >
          Or try a sample still life
        </button>
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { title: 'WebP', copy: 'Shrink photos without a muddy look.' },
          { title: 'PNG', copy: 'Keep edges crisp, transparency intact.' },
          { title: 'Cutout', copy: 'Lift the subject off the background.' },
        ].map((item) => (
          <li
            key={item.title}
            className="rounded-2xl border border-cream-300/80 bg-cream-50/70 px-4 py-4"
          >
            <p className="font-display text-lg text-ink">{item.title}</p>
            <p className="mt-1 text-sm text-cocoa">{item.copy}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PolaroidStack() {
  return (
    <div className="relative h-24 w-28" aria-hidden>
      <span className="absolute top-3 left-3 h-20 w-16 rotate-[-14deg] rounded-md border border-cream-300 bg-cream-50 shadow-paper" />
      <span className="absolute top-2 left-8 h-20 w-16 rotate-[8deg] rounded-md border border-cream-300 bg-cream-100 shadow-paper" />
      <span className="absolute top-1 left-5 flex h-20 w-16 items-end justify-center rounded-md border border-cream-300 bg-gradient-to-br from-caramel/40 via-cream-200 to-umber/50 pb-2 shadow-paper">
        <span className="h-1.5 w-8 rounded-full bg-cream-50/80" />
      </span>
    </div>
  )
}
