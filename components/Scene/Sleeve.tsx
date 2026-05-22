'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../Scroll/scrollState'
import { easeInOut } from '@/lib/easings'

const SLEEVE_WIDTH = 2.62
const SLEEVE_HEIGHT = 3.68
const SLEEVE_DEPTH = 0.04
const SLEEVE_Y = -1.0

const FADE_START = 0.07
const FADE_END = 0.11

export default function Sleeve() {
  const meshRef = useRef<THREE.Mesh>(null)

  const sleeveMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        transmission: 0.95,
        roughness: 0.05,
        ior: 1.45,
        thickness: 0.04,
        transparent: true,
        opacity: 0,
        side: THREE.FrontSide,
        depthWrite: false,
        dithering: true,
      }),
    [],
  )

  const invisibleTopMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ visible: false }),
    [],
  )

  useFrame(() => {
    const t = scrollState.global
    const fadeRange = FADE_END - FADE_START
    const raw = fadeRange > 0 ? (t - FADE_START) / fadeRange : 0
    const clamped = Math.min(1, Math.max(0, raw))
    sleeveMaterial.opacity = easeInOut(clamped) * 0.5
  })

  return (
    <mesh ref={meshRef} position={[0, SLEEVE_Y, 0]} renderOrder={11}>
      <boxGeometry args={[SLEEVE_WIDTH, SLEEVE_HEIGHT, SLEEVE_DEPTH]} />
      <primitive object={sleeveMaterial} attach="material-0" />
      <primitive object={sleeveMaterial} attach="material-1" />
      <primitive object={invisibleTopMaterial} attach="material-2" />
      <primitive object={sleeveMaterial} attach="material-3" />
      <primitive object={sleeveMaterial} attach="material-4" />
      <primitive object={sleeveMaterial} attach="material-5" />
    </mesh>
  )
}
