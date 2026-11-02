import { Download, Eraser, LoaderCircle, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CompareSlider } from '@/components/CompareSlider'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  canvasSupports,
  FORMAT_EXT,
  probeImage,
  rasterize,
  removeImageBackground,
  RESIZE_PRESETS,
  type OutputFormat,
  type ResizePreset,
} from '@/lib/convert'
import { downloadBlob, formatBytes, replaceExtension, useObjectUrl } from '@/lib/utils'

type WorkspaceProps = {
  file: File
  onReset: () => void
}

const FORMATS: { value: OutputFormat; label: string; hint: string }[] = [
  { value: 'webp', label: 'WebP', hint: 'Small, sharp, modern' },
  { value: 'png', label: 'PNG', hint: 'Lossless + transparency' },
  { value: 'jpeg', label: 'JPEG', hint: 'Universal photos' },
  { value: 'avif', label: 'AVIF', hint: 'Smallest, newer browsers' },
]

export function Workspace({ file, onReset }: WorkspaceProps) {
  const [format, setFormat] = useState<OutputFormat>('webp')
  const [quality, setQuality] = useState(0.86)
  const [resize, setResize] = useState<ResizePreset>('original')
  const [fill, setFill] = useState('#ffffff')
  const [cutout, setCutout] = useState<Blob | null>(null)
  const [result, setResult] = useState<Blob | null>(null)
  const [originalSize, setOriginalSize] = useState<{ width: number; height: number } | null>(null)
  const [busy, setBusy] = useState<'convert' | 'cutout' | null>(null)
  const [progress, setProgress] = useState('')
  const [progressValue, setProgressValue] = useState(0)
  const [error, setError] = useState('')
  const [supported, setSupported] = useState<Record<OutputFormat, boolean>>({
    webp: true,
    png: true,
    jpeg: true,
    avif: true,
  })

  const originalUrl = useObjectUrl(file)
  const cutoutUrl = useObjectUrl(cutout)
  const resultUrl = useObjectUrl(result)

  useEffect(() => {
    setSupported({
      webp: canvasSupports('webp'),
      png: true,
      jpeg: true,
      avif: canvasSupports('avif'),
    })
    probeImage(file)
      .then(setOriginalSize)
      .catch(() => setOriginalSize(null))
  }, [file])

  useEffect(() => {
    let cancelled = false
    const source = cutout ?? file
    const maxEdge = resize === 'original' ? undefined : Number(resize)

    setBusy('convert')
    setError('')
    const handle = window.setTimeout(() => {
      rasterize(source, {
        format,
        quality,
        maxEdge,
        background: fill,
      })
        .then((blob) => {
          if (!cancelled) setResult(blob)
        })
        .catch((err: unknown) => {
          if (!cancelled) {
            setResult(null)
            setError(err instanceof Error ? err.message : 'Conversion failed.')
          }
        })
        .finally(() => {
          if (!cancelled) setBusy((current) => (current === 'convert' ? null : current))
        })
    }, 160)

    return () => {
      cancelled = true
      window.clearTimeout(handle)
    }
  }, [file, cutout, format, quality, resize, fill])

  const savings =
    result && result.size < file.size
      ? Math.round((1 - result.size / file.size) * 100)
      : null

  async function onRemoveBackground() {
    setBusy('cutout')
    setError('')
    setProgress('Loading the cutout model…')
    setProgressValue(8)
    try {
      const blob = await removeImageBackground(file, (message, percent) => {
        setProgress(message)
        setProgressValue(percent)
      })
      setCutout(blob)
      setFormat('png')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Background removal failed.')
    } finally {
      setBusy(null)
      setProgress('')
      setProgressValue(0)
    }
  }

  function onDownload() {
    if (!result) return
    downloadBlob(result, replaceExtension(file.name, FORMAT_EXT[format]))
  }

  const previewSrc = resultUrl || cutoutUrl || originalUrl

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="overflow-hidden rounded-[1.75rem] border border-cream-300 bg-cream-50 shadow-paper">
        <div className="flex items-center justify-between gap-3 border-b border-cream-200 px-5 py-3.5">
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{file.name}</p>
            <p className="flex items-center gap-2 text-xs text-cocoa">
              <span>
                {formatBytes(file.size)}
                {originalSize ? ` · ${originalSize.width}×${originalSize.height}` : ''}
              </span>
              {busy === 'convert' ? (
                <LoaderCircle className="size-3 animate-spin text-umber" />
              ) : null}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw />
            Replace
          </Button>
        </div>

        <Tabs defaultValue="result" className="gap-0">
          <div className="px-4 pt-4 sm:px-5">
            <TabsList>
              <TabsTrigger value="result">Result</TabsTrigger>
              <TabsTrigger value="compare">Compare</TabsTrigger>
            </TabsList>
          </div>
          <div className="relative p-4 sm:p-5">
            <TabsContent value="result">
              <div className="checkerboard overflow-hidden rounded-[1.4rem]">
                {previewSrc ? (
                  <img
                    src={previewSrc}
                    alt="Conversion preview"
                    className="mx-auto max-h-[62vh] w-full object-contain"
                  />
                ) : null}
              </div>
            </TabsContent>
            <TabsContent value="compare">
              {originalUrl ? (
                <CompareSlider
                  beforeSrc={originalUrl}
                  afterSrc={resultUrl || cutoutUrl || originalUrl}
                  afterLabel={cutout ? 'Cutout' : FORMAT_EXT[format].toUpperCase()}
                />
              ) : null}
            </TabsContent>

            {busy === 'cutout' ? (
              <div className="absolute inset-4 flex items-end sm:inset-5">
                <div className="flex w-full items-center gap-3 rounded-2xl border border-cream-300 bg-cream-50/95 px-4 py-3 shadow-paper">
                  <LoaderCircle className="size-4 animate-spin text-espresso" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink">Lifting the subject…</p>
                    {progress ? <p className="truncate text-xs text-cocoa">{progress}</p> : null}
                    <Progress className="mt-2" value={progressValue} />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </Tabs>
      </section>

      <aside className="h-fit rounded-[1.75rem] border border-cream-300 bg-cream-50 p-5 shadow-paper lg:sticky lg:top-24">
        <p className="font-display text-2xl text-ink">Convert</p>
        <p className="mt-1 text-sm text-cocoa">Pick a format, then download when the preview looks right.</p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {FORMATS.map((item) => {
            const on = format === item.value
            const disabled = supported[item.value] === false
            return (
              <button
                key={item.value}
                type="button"
                disabled={disabled}
                onClick={() => setFormat(item.value)}
                className={`rounded-2xl border px-3 py-3 text-left transition ${
                  on
                    ? 'border-espresso bg-espresso text-cream-50'
                    : 'border-cream-300 bg-cream-100/60 text-ink hover:border-umber'
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                <span className="block text-sm font-medium">{item.label}</span>
                <span className={`mt-0.5 block text-[11px] ${on ? 'text-cream-300' : 'text-cocoa'}`}>
                  {disabled ? 'Not supported here' : item.hint}
                </span>
              </button>
            )
          })}
        </div>

        {format !== 'png' ? (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <Label htmlFor="quality">Quality</Label>
              <span className="text-xs text-cocoa">{Math.round(quality * 100)}%</span>
            </div>
            <Slider
              id="quality"
              min={50}
              max={100}
              step={1}
              value={[Math.round(quality * 100)]}
              onValueChange={([value]) => setQuality((value ?? 86) / 100)}
            />
          </div>
        ) : null}

        <div className="mt-5">
          <Label className="mb-2 block">Longest edge</Label>
          <Select value={resize} onValueChange={(value) => setResize(value as ResizePreset)}>
            <SelectTrigger aria-label="Resize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RESIZE_PRESETS.map((preset) => (
                <SelectItem key={preset.value} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {format === 'jpeg' ? (
          <div className="mt-5">
            <Label htmlFor="fill" className="mb-2 block">
              JPEG background
            </Label>
            <div className="flex items-center gap-3 rounded-2xl border border-cream-300 bg-cream-100/50 px-3 py-2">
              <input
                id="fill"
                type="color"
                value={fill}
                onChange={(event) => setFill(event.target.value)}
                className="size-8 cursor-pointer rounded-lg border-0 bg-transparent"
              />
              <span className="text-sm text-cocoa">Flatten transparency onto this color.</span>
            </div>
          </div>
        ) : null}

        <Separator className="my-5" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <Label htmlFor="cutout" className="mb-1 block">
              Remove background
            </Label>
            <p className="max-w-[200px] text-xs leading-relaxed text-cocoa">
              Runs a local model the first time. The result is a transparent PNG you can still convert.
            </p>
          </div>
          <Switch
            id="cutout"
            checked={Boolean(cutout) || busy === 'cutout'}
            disabled={busy === 'cutout'}
            onCheckedChange={(checked) => {
              if (checked) void onRemoveBackground()
              else setCutout(null)
            }}
          />
        </div>

        {cutout ? (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-umber">
            <Eraser className="size-3.5" />
            Background removed — preview the cutout on the left.
          </p>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-xl bg-terracotta/10 px-3 py-2 text-sm text-terracotta">{error}</p>
        ) : null}

        <Separator className="my-5" />

        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-cocoa uppercase">Output</p>
            <p className="font-display text-2xl text-ink">
              {result ? formatBytes(result.size) : '—'}
            </p>
            <p className="text-xs text-cocoa">
              {!result
                ? 'Waiting for preview'
                : savings != null
                  ? `${savings}% smaller than the original`
                  : result.size > file.size
                    ? `${Math.round((result.size / file.size - 1) * 100)}% larger than the original`
                    : 'Same size as the original'}
            </p>
          </div>
          <span className="rounded-full bg-cream-200 px-2.5 py-1 text-[11px] tracking-wider text-espresso uppercase">
            .{FORMAT_EXT[format]}
          </span>
        </div>

        <Button className="w-full" size="lg" onClick={onDownload} disabled={!result || Boolean(busy)}>
          <Download />
          Download {FORMAT_EXT[format].toUpperCase()}
        </Button>
      </aside>
    </div>
  )
}
