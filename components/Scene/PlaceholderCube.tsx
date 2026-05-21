'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { scrollState } from '../Scroll/scrollState'

export default function PlaceholderCube() {
  const ref = useRef<Mesh>(null)

  useFrame(() => {
    const mesh = ref.current
    if (!mesh) return
    const t = scrollState.global
    mesh.rotation.y = t * Math.PI * 2
    mesh.rotation.x = t * Math.PI
  })

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#88aaff" roughness={0.4} metalness={0.1} />
    </mesh>
  )
}
