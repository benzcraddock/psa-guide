'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../Scroll/scrollState'
import { easeInOut, easeOut } from '@/lib/easings'

const WIDTH = 3.05
const HEIGHT = 4.3
const DEPTH = 0.09
const TAB_HEIGHT = 0.55
const Y_REST = -1.0
const Y_ABOVE = 3.5

const FADE_START = 0.22
const FADE_END = 0.25

const SLIDE_START = 0.21
const SLIDE_END = 0.27

const TAB_RAISE_START = 0.27
const TAB_RAISE_END = 0.32

export default function SemiRigid() {
  const groupRef = useRef<THREE.Group>(null)
  const tabRef = useRef<THREE.Group>(null)

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        transmission: 0.92,
        roughness: 0.05,
        ior: 1.5,
        thickness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
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
    const fadeRaw = fadeRange > 0 ? (t - FADE_START) / fadeRange : 0
    const fadeClamped = Math.min(1, Math.max(0, fadeRaw))
    material.opacity = easeInOut(fadeClamped) * 0.5

    if (groupRef.current) {
      const slideRange = SLIDE_END - SLIDE_START
      const slideRaw = slideRange > 0 ? (t - SLIDE_START) / slideRange : 0
      const slideClamped = Math.min(1, Math.max(0, slideRaw))
      const eased = easeOut(slideClamped)
      groupRef.current.position.y = Y_ABOVE + (Y_REST - Y_ABOVE) * eased
      groupRef.current.visible = material.opacity > 0
    }

    if (tabRef.current) {
      const raiseRange = TAB_RAISE_END - TAB_RAISE_START
      const raiseRaw = raiseRange > 0 ? (t - TAB_RAISE_START) / raiseRange : 0
      const raiseClamped = Math.min(1, Math.max(0, raiseRaw))
      tabRef.current.rotation.x = -(Math.PI / 2) * (1 - easeInOut(raiseClamped))
    }
  })

  return (
    <group ref={groupRef} position={[0, Y_ABOVE, 0]}>
      <mesh renderOrder={2}>
        <boxGeometry args={[WIDTH, HEIGHT, DEPTH]} />
        <primitive object={material} attach="material-0" />
        <primitive object={material} attach="material-1" />
        <primitive object={invisibleTopMaterial} attach="material-2" />
        <primitive object={material} attach="material-3" />
        <primitive object={material} attach="material-4" />
        <primitive object={material} attach="material-5" />
      </mesh>
      <group ref={tabRef} position={[0, HEIGHT / 2, 0]}>
        <mesh position={[0, TAB_HEIGHT / 2, 0]} renderOrder={2}>
          <boxGeometry args={[WIDTH, TAB_HEIGHT, DEPTH]} />
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
