'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { scrollState } from '../Scroll/scrollState'
import { easeOut } from '@/lib/easings'

const CARD_WIDTH = 2.5
const CARD_HEIGHT = 3.5
const CARD_DEPTH = 0.015

const SLEEVE_WIDTH = 2.62
const SLEEVE_HEIGHT = 3.68
const SLEEVE_DEPTH = 0.04

const SAVER_WIDTH = 3.05
const SAVER_HEIGHT = 4.3
const SAVER_DEPTH = 0.09
const SAVER_TAB_HEIGHT = 0.55

const SETTLE_Y = -1.0

const ROTATION_MAX = Math.PI / 15

const CORNER_DISCARD_GLSL = `#include <clipping_planes_fragment>
{
  vec2 cardSize = vec2(2.5, 3.5);
  float cornerRadius = 0.18;
  vec2 pos = (vMapUv - 0.5) * cardSize;
  vec2 d = abs(pos) - (cardSize * 0.5 - cornerRadius);
  if (length(max(d, 0.0)) - cornerRadius > 0.0) discard;
}`

function attachCornerDiscard<T extends THREE.Material>(material: T) {
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <clipping_planes_fragment>',
      CORNER_DISCARD_GLSL,
    )
  }
  return material
}

interface WaterfallCardProps {
  frontTextureUrl: string
  dropStart: number
  dropEnd: number
  zOffset: number
  restY: number
  side: 'left' | 'right'
  renderOrderBase: number
}

export default function WaterfallCard({
  frontTextureUrl,
  dropStart,
  dropEnd,
  zOffset,
  restY,
  side,
  renderOrderBase,
}: WaterfallCardProps) {
  const groupRef = useRef<THREE.Group>(null)

  const [frontTexture, backTexture] = useTexture([
    frontTextureUrl,
    '/textures/charizard-back.jpg',
  ])

  useEffect(() => {
    frontTexture.colorSpace = THREE.SRGBColorSpace
    backTexture.colorSpace = THREE.SRGBColorSpace
  }, [frontTexture, backTexture])

  const sideSign = side === 'left' ? -1 : 1
  const rotSign = side === 'left' ? 1 : -1

  const path = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(sideSign * 6, 0, zOffset),
        new THREE.Vector3(sideSign * 4, restY * 0.4, zOffset),
        new THREE.Vector3(sideSign * 2, restY * 0.85, zOffset),
        new THREE.Vector3(0, restY, zOffset),
        new THREE.Vector3(0, SETTLE_Y, zOffset),
      ],
      false,
      'catmullrom',
      0.5,
    )
  }, [sideSign, zOffset, restY])

  const edgeMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#0a0a0a', roughness: 0.9 }),
    [],
  )

  const cardFrontMaterial = useMemo(() => {
    frontTexture.colorSpace = THREE.SRGBColorSpace
    frontTexture.needsUpdate = true
    return attachCornerDiscard(
      new THREE.MeshStandardMaterial({
        map: frontTexture,
        roughness: 0.5,
        metalness: 0,
        toneMapped: false,
      }),
    )
  }, [frontTexture])

  const cardBackMaterial = useMemo(() => {
    backTexture.colorSpace = THREE.SRGBColorSpace
    backTexture.needsUpdate = true
    return attachCornerDiscard(
      new THREE.MeshBasicMaterial({
        map: backTexture,
        toneMapped: false,
      }),
    )
  }, [backTexture])

  const sleeveMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.18,
        roughness: 0.4,
        metalness: 0,
        depthWrite: false,
      }),
    [],
  )

  const saverMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e8eef4',
        transparent: true,
        opacity: 0.3,
        roughness: 0.4,
        metalness: 0,
        depthWrite: false,
      }),
    [],
  )

  const invisibleTopMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ visible: false }),
    [],
  )

  const tmpPoint = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    if (!groupRef.current) return
    const t = scrollState.global

    const range = dropEnd - dropStart
    const raw = range > 0 ? (t - dropStart) / range : 0
    const enterT = Math.min(1, Math.max(0, raw))
    const eased = easeOut(enterT)

    path.getPointAt(eased, tmpPoint)
    groupRef.current.position.copy(tmpPoint)

    groupRef.current.rotation.y =
      Math.sin(eased * Math.PI) * ROTATION_MAX * rotSign

    groupRef.current.visible = enterT > 0
  })

  return (
    <group ref={groupRef} position={[sideSign * 6, 0, zOffset]}>
      <mesh>
        <boxGeometry args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]} />
        <primitive object={edgeMaterial} attach="material-0" />
        <primitive object={edgeMaterial} attach="material-1" />
        <primitive object={edgeMaterial} attach="material-2" />
        <primitive object={edgeMaterial} attach="material-3" />
        <primitive object={cardFrontMaterial} attach="material-4" />
        <primitive object={cardBackMaterial} attach="material-5" />
      </mesh>
      <mesh renderOrder={renderOrderBase + 1}>
        <boxGeometry args={[SLEEVE_WIDTH, SLEEVE_HEIGHT, SLEEVE_DEPTH]} />
        <primitive object={sleeveMaterial} attach="material-0" />
        <primitive object={sleeveMaterial} attach="material-1" />
        <primitive object={invisibleTopMaterial} attach="material-2" />
        <primitive object={sleeveMaterial} attach="material-3" />
        <primitive object={sleeveMaterial} attach="material-4" />
        <primitive object={sleeveMaterial} attach="material-5" />
      </mesh>
      <mesh renderOrder={renderOrderBase + 2}>
        <boxGeometry args={[SAVER_WIDTH, SAVER_HEIGHT, SAVER_DEPTH]} />
        <primitive object={saverMaterial} attach="material-0" />
        <primitive object={saverMaterial} attach="material-1" />
        <primitive object={invisibleTopMaterial} attach="material-2" />
        <primitive object={saverMaterial} attach="material-3" />
        <primitive object={saverMaterial} attach="material-4" />
        <primitive object={saverMaterial} attach="material-5" />
      </mesh>
      <mesh
        position={[0, SAVER_HEIGHT / 2 + SAVER_TAB_HEIGHT / 2, 0]}
        renderOrder={renderOrderBase + 2}
      >
        <boxGeometry args={[SAVER_WIDTH, SAVER_TAB_HEIGHT, SAVER_DEPTH]} />
        <primitive object={saverMaterial} attach="material-0" />
        <primitive object={saverMaterial} attach="material-1" />
        <primitive object={saverMaterial} attach="material-2" />
        <primitive object={saverMaterial} attach="material-3" />
        <primitive object={saverMaterial} attach="material-4" />
        <primitive object={saverMaterial} attach="material-5" />
      </mesh>
    </group>
  )
}
