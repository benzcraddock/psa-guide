'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { scrollState } from '../Scroll/scrollState'
import { easeInOut, easeOut } from '@/lib/easings'

const WIDTH = 3.7
const HEIGHT = 5.6
const DEPTH = 0.05
const Y = -1.0
const FRONT_Z_REST = 0.18
const BACK_Z_REST = -0.24
const OFFSCREEN_OFFSET = 4.0

const FRONT_SLIDE_START = 0.50
const FRONT_SLIDE_END = 0.55
const BACK_SLIDE_START = 0.51
const BACK_SLIDE_END = 0.56

export default function Cardboard() {
  const frontRef = useRef<THREE.Mesh>(null)
  const backRef = useRef<THREE.Mesh>(null)

  const [colorMap, normalMap, roughnessMap] = useTexture([
    '/textures/Paper005_2K-JPG_Color.jpg',
    '/textures/Paper005_2K-JPG_NormalDX.jpg',
    '/textures/Paper005_2K-JPG_Roughness.jpg',
  ])

  const backColorMap = useMemo(() => colorMap.clone(), [colorMap])
  const backNormalMap = useMemo(() => normalMap.clone(), [normalMap])
  const backRoughnessMap = useMemo(() => roughnessMap.clone(), [roughnessMap])

  useEffect(() => {
    for (const tex of [colorMap, normalMap, roughnessMap]) {
      tex.wrapS = THREE.RepeatWrapping
      tex.wrapT = THREE.RepeatWrapping
      tex.repeat.set(3, 3)
      tex.needsUpdate = true
    }
    colorMap.colorSpace = THREE.SRGBColorSpace

    for (const tex of [backColorMap, backNormalMap, backRoughnessMap]) {
      tex.wrapS = THREE.RepeatWrapping
      tex.wrapT = THREE.RepeatWrapping
      tex.repeat.set(3, 3)
      tex.rotation = Math.PI / 2
      tex.center.set(0.5, 0.5)
      tex.needsUpdate = true
    }
    backColorMap.colorSpace = THREE.SRGBColorSpace
  }, [
    colorMap,
    normalMap,
    roughnessMap,
    backColorMap,
    backNormalMap,
    backRoughnessMap,
  ])

  const frontMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: colorMap,
        normalMap,
        normalScale: new THREE.Vector2(1, -1),
        roughnessMap,
        metalness: 0,
        roughness: 1,
        transparent: true,
        opacity: 0,
      }),
    [colorMap, normalMap, roughnessMap],
  )

  const backMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: backColorMap,
        normalMap: backNormalMap,
        normalScale: new THREE.Vector2(1, -1),
        roughnessMap: backRoughnessMap,
        metalness: 0,
        roughness: 1,
        transparent: true,
        opacity: 0,
      }),
    [backColorMap, backNormalMap, backRoughnessMap],
  )

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
