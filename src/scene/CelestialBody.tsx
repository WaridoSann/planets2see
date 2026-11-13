import { useEffect, useMemo, useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { DoubleSide, CanvasTexture, Color, type Group } from 'three'
import { type Body } from '../data/bodies'
import { orbitPosition, qualityConfig, textureUrl, type ResolvedQuality } from '../lib/simulation'
import { useTextureAsset } from './useTextureAsset'
import Atmosphere from './Atmosphere'
import type { SimulationClock } from './types'

interface Props {
  body: Body; clock: SimulationClock; quality: ResolvedQuality
  selected: boolean; intro: boolean; labels: boolean; reducedMotion: boolean; paused: boolean
  onSelect: () => void; onTextureError: () => void
}

function Rings({ body }: { body: Body }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256; canvas.height = 1
    const context = canvas.getContext('2d')!
    for (let x = 0; x < 256; x++) {
      const t = x / 255
      const gap = (t > .48 && t < .53) || (t > .86 && t < .88)
      const alpha = gap ? .04 : .3 + .5 * (Math.sin(x * 1.37) * .5 + .5)
      context.fillStyle = body.id === 'saturn' ? `rgba(204,187,153,${alpha})` : `rgba(142,174,175,${alpha * .5})`
      context.fillRect(x, 0, 1, 1)
    }
    const result = new CanvasTexture(canvas)
    return result
  }, [body.id])
  useEffect(() => () => texture.dispose(), [texture])
  // R3F owns the geometry/material. The generated map is explicitly disposed below.
  const geometry = useMemo(() => {
    // RingGeometry's default UVs are planar; remap u to radial distance for concentric rings.
    return { inner: body.radius * 1.35, outer: body.radius * (body.id === 'saturn' ? 2.25 : 1.85) }
  }, [body.radius, body.id])
  return <mesh rotation={[-Math.PI / 2, 0, 0]}>
    <ringGeometry args={[geometry.inner, geometry.outer, 160]} onUpdate={g => {
      const p = g.attributes.position, uv = g.attributes.uv
      for (let i = 0; i < p.count; i++) uv.setXY(i, (Math.hypot(p.getX(i), p.getY(i)) - geometry.inner) / (geometry.outer - geometry.inner), .5)
      uv.needsUpdate = true
    }} />
    <meshStandardMaterial map={texture} side={DoubleSide} transparent opacity={body.id === 'saturn' ? .95 : .65} roughness={1} depthWrite={false} onUpdate={m => { m.userData.generatedMap = texture }} />
  </mesh>
}

function EarthClouds({ radius, quality, onTextureError }: { radius: number; quality: ResolvedQuality; onTextureError: () => void }) {
  const texture = useTextureAsset(textureUrl('clouds', quality), onTextureError, false)
  return <mesh scale={radius * 1.013}>
    <sphereGeometry args={[1, 48, 32]} />
    <meshStandardMaterial alphaMap={texture} transparent opacity={texture ? .78 : 0} depthWrite={false} roughness={1} onUpdate={material => { material.needsUpdate = true }} />
  </mesh>
}

export default function CelestialBody({ body, clock, quality, selected, intro, labels, paused, onSelect, onTextureError }: Props) {
  const group = useRef<Group>(null)
  const surface = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const textureQuality = (selected || (intro && body.id === 'earth')) ? quality : 'low'
  const texture = useTextureAsset(textureUrl(body.id, textureQuality), onTextureError)
  const isSun = body.id === 'sun'
  useFrame((_, delta) => {
    group.current?.position.set(...orbitPosition(body.id, clock.current))
    if (surface.current && !paused) {
      // Rotation is deliberately slowed for legibility, retaining each body's direction.
      surface.current.rotation.y += Math.min(delta, .05) * .12 * Math.sign(body.day) * Math.min(2, 24 / Math.abs(body.day))
    }
  })
  const stop = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onSelect() }
  return <group ref={group} position={orbitPosition(body.id, clock.current)}>
    <group rotation={[0, 0, body.tilt * Math.PI / 180]}>
      <group ref={surface}>
        <mesh onClick={stop} onPointerOver={e => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }} onPointerOut={() => { setHovered(false); document.body.style.cursor = '' }}>
          <sphereGeometry args={[body.radius, qualityConfig[quality].segments, qualityConfig[quality].segments]} />
          {isSun
            ? <meshBasicMaterial map={texture} color={new Color('#fff1cc').multiplyScalar(2.1)} toneMapped={false} onUpdate={material => { material.needsUpdate = true }} />
            : <meshStandardMaterial map={texture} color={texture ? '#ffffff' : body.color} roughness={1} metalness={0} onUpdate={material => { material.needsUpdate = true }} />}
        </mesh>
        {body.id === 'earth' && <EarthClouds radius={body.radius} quality={textureQuality} onTextureError={onTextureError} />}
      </group>
      {(body.id === 'saturn' || body.id === 'uranus') && <Rings body={body} />}
    </group>
    {['earth', 'venus', 'uranus', 'neptune'].includes(body.id) && <Atmosphere radius={body.radius} color={body.color} />}
    {isSun && <mesh scale={body.radius * 1.08}><sphereGeometry args={[1, 32, 32]} /><meshBasicMaterial color="#ffa33d" transparent opacity={.04} depthWrite={false} /></mesh>}
    {labels && !intro && <Html center position={[0, body.radius * 1.3 + .6, 0]} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
      <button tabIndex={-1} className={`scene-label ${selected || hovered ? 'active' : ''}`} onClick={onSelect} style={{ pointerEvents: 'auto' }} aria-hidden="true">{body.name}<span /></button>
    </Html>}
  </group>
}
