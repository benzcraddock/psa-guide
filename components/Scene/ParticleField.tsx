'use client'

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 250
const FIELD_RADIUS_X = 8
const FIELD_RADIUS_Y = 7
const FIELD_RADIUS_Z = 8
const CLEAR_RADIUS = 2.5

const DRIFT_SPEED = 0.012

const MOUSE_SHIFT_X = 0.45
const MOUSE_SHIFT_Y = 0.3
const MOUSE_LERP = 0.04

export default function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null)
  const driftSeedsRef = useRef<Float32Array | null>(null)
  const { pointer } = useThree()

  const geometry = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const seeds = new Float32Array(PARTICLE_COUNT * 3)

    let placed = 0
    while (placed < PARTICLE_COUNT) {
      const x = (Math.random() * 2 - 1) * FIELD_RADIUS_X
      const y = (Math.random() * 2 - 1) * FIELD_RADIUS_Y - 1
      const z = (Math.random() * 2 - 1) * FIELD_RADIUS_Z
      if (Math.hypot(x, y + 1, z) < CLEAR_RADIUS) continue

      positions[placed * 3] = x
      positions[placed * 3 + 1] = y
      positions[placed * 3 + 2] = z

      seeds[placed * 3] = Math.random() * Math.PI * 2
      seeds[placed * 3 + 1] = Math.random() * Math.PI * 2
      seeds[placed * 3 + 2] = Math.random() * Math.PI * 2

      placed++
    }

    driftSeedsRef.current = seeds

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current || !driftSeedsRef.current) return
    const attr = pointsRef.current.geometry.getAttribute(
      'position',
    ) as THREE.BufferAttribute
    const positions = attr.array as Float32Array
    const seeds = driftSeedsRef.current
    const t = clock.elapsedTime

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      positions[i3] += Math.sin(t * 0.3 + seeds[i3]) * DRIFT_SPEED * 0.02
      positions[i3 + 1] +=
        Math.sin(t * 0.25 + seeds[i3 + 1]) * DRIFT_SPEED * 0.02
      positions[i3 + 2] +=
        Math.cos(t * 0.28 + seeds[i3 + 2]) * DRIFT_SPEED * 0.02
    }

    attr.needsUpdate = true

    pointsRef.current.position.x = THREE.MathUtils.lerp(
      pointsRef.current.position.x,
      -pointer.x * MOUSE_SHIFT_X,
      MOUSE_LERP,
    )
    pointsRef.current.position.y = THREE.MathUtils.lerp(
      pointsRef.current.position.y,
      -pointer.y * MOUSE_SHIFT_Y,
      MOUSE_LERP,
    )
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#ffffff"
        size={0.018}
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </points>
  )
}
