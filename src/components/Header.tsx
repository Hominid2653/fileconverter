import { ShieldCheck } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type HeaderProps = {
  onReset?: () => void
  hasFile?: boolean
}

export function Header({ onReset, hasFile }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-cream-300/60 bg-cream-50/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <button
          type="button"
          onClick={onReset}
          className="group flex items-center gap-3 text-left"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-espresso text-cream-50 shadow-paper">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="7.25" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="2.4" fill="currentColor" />
            </svg>
          </span>
          <span>
            <span className="font-display text-lg leading-none tracking-tight text-ink">
              Sienna
            </span>
            <span className="mt-0.5 block text-[11px] tracking-[0.22em] text-cocoa uppercase">
              Image atelier
            </span>
          </span>
        </button>

        <div className="flex items-center gap-3">
          {hasFile ? (
            <button
              type="button"
              onClick={onReset}
              className="hidden text-sm text-cocoa transition hover:text-ink sm:inline"
            >
              New file
            </button>
          ) : null}
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="hidden items-center gap-1.5 rounded-full border border-cream-300 bg-cream-100 px-3 py-1.5 text-xs text-cocoa sm:inline-flex">
                <ShieldCheck className="size-3.5" />
                Stays in your browser
              </span>
            </TooltipTrigger>
            <TooltipContent>Images are converted locally. Nothing is uploaded.</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  )
}
