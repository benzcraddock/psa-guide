'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../Scroll/scrollState'
import { easeInOut } from '@/lib/easings'

const WIDTH = 3.35
const HEIGHT = 4.65
const DEPTH = 0.06
const FLAP_HEIGHT = 0.6
const Y = -1.0

const FADE_START = 0.25
const FADE_END = 0.28

const FLAP_FOLD_START = 0.29
const FLAP_FOLD_END = 0.34

export default function TeamBag() {
  const bodyRef = useRef<THREE.Mesh>(null)
  const flapRef = useRef<THREE.Group>(null)

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        transmission: 0.92,
        roughness: 0.08,
        ior: 1.4,
        thickness: 0.04,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [],
  )

  useFrame(() => {
    const t = scrollState.global

    const fadeRange = FADE_END - FADE_START
    const fadeRaw = fadeRange > 0 ? (t - FADE_START) / fadeRange : 0
    const fadeClamped = Math.min(1, Math.max(0, fadeRaw))
    material.opacity = easeInOut(fadeClamped) * 0.5
    const visible = material.opacity > 0
    if (bodyRef.current) bodyRef.current.visible = visible
    if (flapRef.current) flapRef.current.visible = visible

    if (flapRef.current) {
      const foldRange = FLAP_FOLD_END - FLAP_FOLD_START
      const foldRaw = foldRange > 0 ? (t - FLAP_FOLD_START) / foldRange : 0
      const foldClamped = Math.min(1, Math.max(0, foldRaw))
      flapRef.current.rotation.x = (Math.PI / 2) * (1 - easeInOut(foldClamped)) * -1
    }
  })

  return (
    <group position={[0, Y, 0]}>
      <mesh ref={bodyRef}>
        <boxGeometry args={[WIDTH, HEIGHT, DEPTH]} />
        <primitive object={material} attach="material-0" />
        <primitive object={material} attach="material-1" />
        <primitive object={material} attach="material-2" />
        <primitive object={material} attach="material-3" />
        <primitive object={material} attach="material-4" />
        <primitive object={material} attach="material-5" />
      </mesh>
      <group ref={flapRef} position={[0, HEIGHT / 2, 0]}>
        <mesh position={[0, FLAP_HEIGHT / 2, 0]}>
          <boxGeometry args={[WIDTH, FLAP_HEIGHT, DEPTH]} />
          <primitive object={material} attach="material-0" />
          <primitive object={material} attach="material-1" />
          <primitive object={material} attach="material-2" />
          <primitive object={material} attach="material-3" />
          <primitive object={material} attach="material-4" />
          <primitive object={material} attach="material-5" />
        </mesh>
      </group>
    </group>
  )
}
