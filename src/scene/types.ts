import type { MutableRefObject } from 'react'
import type { BodyId } from '../data/bodies'
import type { ResolvedQuality } from '../lib/simulation'

export interface SceneProps {
  selected: BodyId | null
  intro: boolean
  paused: boolean
  speed: number
  quality: ResolvedQuality
  reducedMotion: boolean
  labels: boolean
  onSelect: (id: BodyId) => void
  onReady: () => void
  onTextureError: () => void
  onFailure: () => void
  onLoading: (progress: number) => void
}
export type SimulationClock = MutableRefObject<number>
