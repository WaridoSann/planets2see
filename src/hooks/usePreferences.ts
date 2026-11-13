import { useEffect, useState } from 'react'
import { resolveQuality, type Quality } from '../lib/simulation'

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return reduced
}
export function readPreference(key: string, fallback: string) {
  try { return localStorage.getItem(`p2s-${key}`) ?? fallback } catch { return fallback }
}
export function savePreference(key: string, value: string) {
  try { localStorage.setItem(`p2s-${key}`, value) } catch { /* Private mode can disable storage. */ }
}
export function useQuality() {
  const [quality, setQuality] = useState<Quality>(() => {
    const value = readPreference('quality', 'auto')
    return ['auto', 'low', 'medium', 'high'].includes(value) ? value as Quality : 'auto'
  })
  useEffect(() => savePreference('quality', quality), [quality])
  const mobile = window.matchMedia('(pointer: coarse)').matches
  const resolved = resolveQuality(quality, navigator.hardwareConcurrency, mobile)
  return { quality, setQuality, resolved }
}
