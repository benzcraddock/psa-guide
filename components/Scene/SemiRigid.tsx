'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../Scroll/scrollState'
import { easeInOut } from '@/lib/easings'

const WIDTH = 3.05
const HEIGHT = 4.3
const DEPTH = 0.09
const Y = -1.0

const FADE_START = 0.17
const FADE_END = 0.20

export default function SemiRigid() {
  const meshRef = useRef<THREE.Mesh>(null)

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#dde4ea',
        transmission: 0.75,
        roughness: 0.18,
        ior: 1.5,
        thickness: 0.1,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [],
  )

  const invisibleTopMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ visible: false }),
    [],
  )

  useFrame(() => {
    const t = scrollState.global
    const range = FADE_END - FADE_START
    const raw = range > 0 ? (t - FADE_START) / range : 0
    const clamped = Math.min(1, Math.max(0, raw))
    material.opacity = easeInOut(clamped) * 0.85
    if (meshRef.current) meshRef.current.visible = material.opacity > 0
  })

  return (
    <mesh ref={meshRef} position={[0, Y, 0]}>
      <boxGeometry args={[WIDTH, HEIGHT, DEPTH]} />
      <primitive object={material} attach="material-0" />
      <primitive object={material} attach="material-1" />
      <primitive object={invisibleTopMaterial} attach="material-2" />
      <primitive object={material} attach="material-3" />
      <primitive object={material} attach="material-4" />
      <primitive object={material} attach="material-5" />
    </mesh>
  )
}
