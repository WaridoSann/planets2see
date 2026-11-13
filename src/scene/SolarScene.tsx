import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line, Stars, useProgress } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { ACESFilmicToneMapping, Vector3 } from 'three'
import { bodies } from '../data/bodies'
import { qualityConfig } from '../lib/simulation'
import CelestialBody from './CelestialBody'
import CameraRig from './CameraRig'
import type { SceneProps } from './types'

function Orbits({ visible }: { visible: boolean }) {
  const paths = useMemo(() => bodies.filter(body => body.orbit).map(body => ({
    id: body.id, points: Array.from({ length: 181 }, (_, i) => new Vector3(Math.cos(i / 180 * Math.PI * 2) * body.orbit, 0, Math.sin(i / 180 * Math.PI * 2) * body.orbit)),
  })), [])
  return <group visible={visible}>{paths.map(path => <Line key={path.id} points={path.points} color="#7e96b8" transparent opacity={.16} lineWidth={.65} />)}</group>
}

function World(props: SceneProps) {
  const clock = useRef(0)
  const config = qualityConfig[props.quality]
  useFrame((_, delta) => {
    if (!props.paused && !props.intro) clock.current += Math.min(delta, .05) * props.speed
  }, -2)
  useEffect(props.onReady, [props.onReady])
  return <>
    <color attach="background" args={['#06090f']} />
    <ambientLight intensity={.2} />
    <pointLight position={[0, 0, 0]} intensity={3} decay={0} color="#fff1de" />
    <Stars radius={180} depth={100} count={config.stars} factor={3.6} saturation={.15} fade speed={props.paused ? 0 : .12} />
    <Orbits visible={!props.intro} />
    {bodies.map(body => <CelestialBody key={body.id} body={body} clock={clock} quality={props.quality}
      selected={props.selected === body.id} intro={props.intro} labels={props.labels} reducedMotion={props.reducedMotion} paused={props.paused || props.intro}
      onSelect={() => props.onSelect(body.id)} onTextureError={props.onTextureError} />)}
    <CameraRig selected={props.selected} intro={props.intro} clock={clock} reducedMotion={props.reducedMotion} />
    {config.bloom && <EffectComposer multisampling={0}><Bloom luminanceThreshold={1.2} luminanceSmoothing={.3} intensity={.6} mipmapBlur /></EffectComposer>}
  </>
}

export default function SolarScene(props: SceneProps) {
  const config = qualityConfig[props.quality]
  const { active, progress } = useProgress()
  useEffect(() => props.onLoading(active ? progress : 100), [active, progress, props.onLoading])
  return <Canvas camera={{ position: [0, 55, 70], fov: 42, near: .05, far: 550 }} dpr={[1, config.dpr]}
    gl={{ antialias: props.quality !== 'high', alpha: false, powerPreference: 'high-performance', toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1 }}
    onCreated={({ gl }) => { gl.domElement.setAttribute('aria-label', 'Système solaire interactif en trois dimensions'); gl.domElement.addEventListener('webglcontextlost', props.onFailure) }}>
    <Suspense fallback={null}><World {...props} /></Suspense>
  </Canvas>
}
