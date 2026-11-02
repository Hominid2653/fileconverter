import { clsx, type ClassValue } from 'clsx'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** i
  return `${value >= 10 || i === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[i]}`
}

export function replaceExtension(name: string, ext: string) {
  const base = name.replace(/\.[^/.]+$/, '')
  return `${base}.${ext}`
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function useObjectUrl(source: Blob | null) {
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (!source) {
      setUrl('')
      return
    }
    const next = URL.createObjectURL(source)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [source])

  return url
}
