import { useEffect, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import gsap from 'gsap'
import { bodyById, type BodyId } from '../data/bodies'
import { orbitPosition } from '../lib/simulation'
import type { SimulationClock } from './types'

export default function CameraRig({ selected, intro, clock, reducedMotion }: { selected: BodyId | null; intro: boolean; clock: SimulationClock; reducedMotion: boolean }) {
  const controls = useRef<OrbitControlsImpl>(null)
  const { camera, size, gl } = useThree()
  const transition = useRef<gsap.core.Tween | null>(null)
  const moving = useRef(false)
  const previous = useRef(new Vector3())
  const first = useRef(true)
  const focus = intro ? 'earth' : selected

  useEffect(() => {
    const orbit = controls.current
    if (!orbit) return
    transition.current?.kill()
    moving.current = true
    gl.domElement.setAttribute('aria-busy', 'true')
    orbit.enabled = false
    const startPosition = camera.position.clone()
    const startTarget = orbit.target.clone()
    const progress = { value: 0 }
    const apply = () => {
      const center = focus ? new Vector3(...orbitPosition(focus, clock.current)) : new Vector3()
      let endPosition: Vector3, endTarget: Vector3
      if (focus) {
        const body = bodyById[focus]
        const distance = body.radius * (focus === 'saturn' ? 7.7 : 5.2) * (size.width < 700 ? 1.38 : 1)
        const direction = center.clone().negate().normalize()
        if (focus === 'sun') direction.set(.3, 0, 1)
        direction.y = .25
        direction.applyAxisAngle(new Vector3(0, 1, 0), -.45).normalize()
        endPosition = center.clone().addScaledVector(direction, distance)
        const right = new Vector3().crossVectors(new Vector3(0, 1, 0), direction).normalize()
        const offset = size.width > 900 ? (intro ? -.23 : .12) : 0
        endTarget = center.clone().addScaledVector(right, distance * offset)
        if (size.width < 700 && !intro) endTarget.y -= distance * .15
      } else {
        const distance = size.width < 700 ? 115 : 80
        endPosition = new Vector3(0, distance * .67, distance * .86)
        endTarget = new Vector3()
      }
      camera.position.lerpVectors(startPosition, endPosition, progress.value)
      orbit.target.lerpVectors(startTarget, endTarget, progress.value)
      orbit.update()
      previous.current.copy(center)
    }
    const immediate = first.current || reducedMotion
    first.current = false
    transition.current = gsap.to(progress, {
      value: 1, duration: immediate ? 0 : 1.65, ease: 'power3.inOut', onUpdate: apply,
      onComplete: () => { apply(); moving.current = false; orbit.enabled = true; gl.domElement.setAttribute('aria-busy', 'false'); gl.domElement.dataset.focus = focus ?? 'overview' },
    })
    return () => { transition.current?.kill(); orbit.enabled = true }
  }, [focus, intro, camera, clock, reducedMotion, size.width < 700, size.width > 900])

  useFrame(() => {
    const orbit = controls.current
    if (!orbit || moving.current || !focus) return
    const center = new Vector3(...orbitPosition(focus, clock.current))
    const delta = center.clone().sub(previous.current)
    camera.position.add(delta)
    orbit.target.add(delta)
    previous.current.copy(center)
  }, -1)

  const min = focus ? bodyById[focus].radius * (focus === 'saturn' ? 2.6 : 1.6) : 5
  return <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={.065} minDistance={min} maxDistance={190} maxPolarAngle={Math.PI * .94} enablePan={!focus} zoomSpeed={.8} rotateSpeed={.55} />
}
