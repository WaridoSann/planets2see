import { bodyById, bodies, type BodyId } from '../data/bodies'

export type Quality = 'auto' | 'low' | 'medium' | 'high'
export type ResolvedQuality = Exclude<Quality, 'auto'>
export function resolveQuality(value: Quality, cores = 4, mobile = false): ResolvedQuality {
  return value === 'auto' ? (mobile || cores <= 4 ? 'low' : 'medium') : value
}
export function orbitPosition(id: BodyId, days: number): [number, number, number] {
  const body = bodyById[id]
  const angle = body.phase + (body.year ? days / body.year * Math.PI * 2 : 0)
  return [Math.cos(angle) * body.orbit, 0, Math.sin(angle) * body.orbit]
}
export function neighbor(id: BodyId | null, direction: -1 | 1): BodyId {
  const index = id ? bodies.findIndex(body => body.id === id) : 0
  return bodies[(index + direction + bodies.length) % bodies.length].id
}
export function textureUrl(id: string, quality: ResolvedQuality) {
  return `${import.meta.env.BASE_URL}textures/${quality === 'high' ? '2k' : '1k'}/${id}.jpg`
}
export const qualityConfig = {
  low: { dpr: 1, segments: 32, stars: 1400, bloom: false },
  medium: { dpr: 1.5, segments: 48, stars: 2800, bloom: true },
  high: { dpr: 2, segments: 80, stars: 5000, bloom: true },
}
