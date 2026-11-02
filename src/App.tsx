import { useCallback, useEffect, useState } from 'react'
import { DropZone } from '@/components/DropZone'
import { Header } from '@/components/Header'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Workspace } from '@/components/Workspace'

export default function App() {
  const [file, setFile] = useState<File | null>(null)

  const onReset = useCallback(() => setFile(null), [])

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const item = [...(event.clipboardData?.items ?? [])].find((entry) =>
        entry.type.startsWith('image/'),
      )
      const pasted = item?.getAsFile()
      if (pasted) setFile(pasted)
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [])

  return (
    <TooltipProvider>
      <div className="relative min-h-dvh overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-24 size-[28rem] rounded-full bg-caramel/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-20 size-[32rem] rounded-full bg-umber/10 blur-3xl"
        />

        <Header hasFile={Boolean(file)} onReset={onReset} />

        <main className="relative mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          {file ? <Workspace file={file} onReset={onReset} /> : <DropZone onFile={setFile} />}
        </main>

        <footer className="relative mx-auto max-w-6xl px-5 pb-10 text-center text-xs text-cocoa sm:px-8">
          Sienna converts on-device. Your photographs are not sent to a server.
        </footer>
      </div>
    </TooltipProvider>
  )
}
