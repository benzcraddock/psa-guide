'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../Scroll/scrollState'
import { easeInOut, easeOut } from '@/lib/easings'

const WIDTH = 3.6
const HEIGHT = 4.95
const DEPTH = 0.05
const Y = -1.0
const FRONT_Z_REST = 0.18
const BACK_Z_REST = -0.18
const OFFSCREEN_OFFSET = 4.0

const FRONT_SLIDE_START = 0.35
const FRONT_SLIDE_END = 0.4
const BACK_SLIDE_START = 0.36
const BACK_SLIDE_END = 0.41

function makeMaterial() {
  return new THREE.MeshStandardMaterial({
    color: '#b69366',
    roughness: 0.95,
    metalness: 0,
    transparent: true,
    opacity: 0,
  })
}

export default function Cardboard() {
  const frontRef = useRef<THREE.Mesh>(null)
  const backRef = useRef<THREE.Mesh>(null)

  const frontMaterial = useMemo(makeMaterial, [])
  const backMaterial = useMemo(makeMaterial, [])

  useFrame(() => {
    const t = scrollState.global

    if (frontRef.current) {
      const range = FRONT_SLIDE_END - FRONT_SLIDE_START
      const raw = range > 0 ? (t - FRONT_SLIDE_START) / range : 0
      const clamped = Math.min(1, Math.max(0, raw))
      const eased = easeOut(clamped)
      const startZ = FRONT_Z_REST + OFFSCREEN_OFFSET
      frontRef.current.position.z = startZ + (FRONT_Z_REST - startZ) * eased
      frontMaterial.opacity = easeInOut(clamped)
      frontRef.current.visible = frontMaterial.opacity > 0
    }

    if (backRef.current) {
      const range = BACK_SLIDE_END - BACK_SLIDE_START
      const raw = range > 0 ? (t - BACK_SLIDE_START) / range : 0
      const clamped = Math.min(1, Math.max(0, raw))
      const eased = easeOut(clamped)
      const startZ = BACK_Z_REST - OFFSCREEN_OFFSET
      backRef.current.position.z = startZ + (BACK_Z_REST - startZ) * eased
      backMaterial.opacity = easeInOut(clamped)
      backRef.current.visible = backMaterial.opacity > 0
    }
  })

  return (
    <group position={[0, Y, 0]}>
      <mesh ref={frontRef} position={[0, 0, FRONT_Z_REST]}>
        <boxGeometry args={[WIDTH, HEIGHT, DEPTH]} />
        <primitive object={frontMaterial} />
      </mesh>
      <mesh ref={backRef} position={[0, 0, BACK_Z_REST]}>
        <boxGeometry args={[WIDTH, HEIGHT, DEPTH]} />
        <primitive object={backMaterial} />
      </mesh>
    </group>
  )
}
