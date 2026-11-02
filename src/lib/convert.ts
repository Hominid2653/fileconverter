export type OutputFormat = 'webp' | 'png' | 'jpeg' | 'avif'

export const FORMAT_MIME: Record<OutputFormat, string> = {
  webp: 'image/webp',
  png: 'image/png',
  jpeg: 'image/jpeg',
  avif: 'image/avif',
}

export const FORMAT_EXT: Record<OutputFormat, string> = {
  webp: 'webp',
  png: 'png',
  jpeg: 'jpg',
  avif: 'avif',
}

export type ResizePreset = 'original' | '3840' | '1920' | '1280' | '800'

export const RESIZE_PRESETS: { value: ResizePreset; label: string }[] = [
  { value: 'original', label: 'Original' },
  { value: '3840', label: '4K · 3840px' },
  { value: '1920', label: '1080p · 1920px' },
  { value: '1280', label: '720p · 1280px' },
  { value: '800', label: 'Web · 800px' },
]

export function canvasSupports(format: OutputFormat) {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  try {
    return canvas.toDataURL(FORMAT_MIME[format]).startsWith(`data:${FORMAT_MIME[format]}`)
  } catch {
    return false
  }
}

function fitWithin(width: number, height: number, maxEdge?: number) {
  if (!maxEdge || Math.max(width, height) <= maxEdge) {
    return { width, height }
  }
  const scale = maxEdge / Math.max(width, height)
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

export async function rasterize(
  source: Blob,
  options: {
    format: OutputFormat
    quality: number
    maxEdge?: number
    background?: string
  },
): Promise<Blob> {
  const bitmap = await createImageBitmap(source)
  const { width, height } = fitWithin(bitmap.width, bitmap.height, options.maxEdge)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    throw new Error('Could not create a drawing context.')
  }

  if (options.format === 'jpeg') {
    ctx.fillStyle = options.background ?? '#ffffff'
    ctx.fillRect(0, 0, width, height)
  }

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const mime = FORMAT_MIME[options.format]
  const quality = options.format === 'png' ? undefined : options.quality

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, mime, quality)
  })

  if (!blob) {
    throw new Error(`This browser could not encode ${options.format.toUpperCase()}.`)
  }

  return blob
}

export async function probeImage(source: Blob) {
  const bitmap = await createImageBitmap(source)
  const size = { width: bitmap.width, height: bitmap.height }
  bitmap.close()
  return size
}

export async function removeImageBackground(
  source: Blob,
  onProgress?: (message: string, percent: number) => void,
) {
  const { removeBackground } = await import('@imgly/background-removal')
  return removeBackground(source, {
    progress: (key, current, total) => {
      const pct = total ? Math.round((current / total) * 100) : 0
      onProgress?.(`${key.replaceAll(':', ' · ')} ${pct}%`, pct)
    },
  })
}
