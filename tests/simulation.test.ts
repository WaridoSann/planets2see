import { describe, expect, it, vi } from 'vitest'
import { bodies, bodyById } from '../src/data/bodies'
import { neighbor, orbitPosition, resolveQuality, textureUrl } from '../src/lib/simulation'

describe('simulation illustrative', () => {
  it('maintient le Soleil au centre et le rayon des huit orbites', () => {
    for (const body of bodies) {
      for (const days of [0, 10, 365.25, 10000]) {
        const [x, y, z] = orbitPosition(body.id, days)
        expect(Math.hypot(x, z)).toBeCloseTo(body.orbit, 10)
        expect(y).toBe(0)
      }
    }
    expect(orbitPosition('sun', 15000)).toEqual([0, 0, 0])
  })
  it('retrouve la position initiale après une révolution complète', () => {
    for (const body of bodies.filter(item => item.year)) {
      const start = orbitPosition(body.id, 0), end = orbitPosition(body.id, body.year)
      start.forEach((value, index) => expect(end[index]).toBeCloseTo(value, 10))
    }
  })
  it('boucle aux deux extrémités de la navigation', () => {
    expect(neighbor('neptune', 1)).toBe('sun')
    expect(neighbor('sun', -1)).toBe('neptune')
    expect(neighbor('earth', 1)).toBe('mars')
    expect(neighbor('earth', -1)).toBe('venus')
  })
  it('choisit une qualité conservatrice et respecte le choix explicite', () => {
    expect(resolveQuality('auto', 16, true)).toBe('low')
    expect(resolveQuality('auto', 2, false)).toBe('low')
    expect(resolveQuality('auto', 12, false)).toBe('medium')
    expect(resolveQuality('high', 2, true)).toBe('high')
    vi.stubEnv('BASE_URL', '/planets2see/')
    expect(textureUrl('earth', 'high')).toBe('/planets2see/textures/2k/earth.jpg')
    vi.unstubAllEnvs()
  })
  it('dispose de neuf identifiants uniques, de données et de références institutionnelles', () => {
    expect(new Set(bodies.map(body => body.id)).size).toBe(9)
    expect(bodyById.venus.day).toBeLessThan(0)
    expect(bodyById.uranus.day).toBeLessThan(0)
    for (const body of bodies) {
      expect(body.source).toMatch(/^https:\/\/science.nasa.gov\//)
      expect(body.mass).toContain('kg')
      expect(body.diameter).toContain('km')
      expect(body.facts.length).toBeGreaterThanOrEqual(3)
    }
  })
})
