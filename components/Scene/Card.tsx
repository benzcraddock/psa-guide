'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useTexture } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import { extend, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { HoloMaterial } from './HoloMaterial'
import { scrollState } from '../Scroll/scrollState'
import { easeInOut } from '@/lib/easings'

extend({ HoloMaterial })

const CARD_WIDTH = 2.5
const CARD_HEIGHT = 3.5
const CARD_DEPTH = 0.015

const LIGHT_DIR = new THREE.Vector3(-0.3, 0.7, 0.6).normalize()

const SLIDE_START = 0.10
const SLIDE_END = 0.15
const CARD_REST_Y = -1.0

const SWEEP_START = 0.03
const SWEEP_END = 0.10

export default function Card() {
  const groupRef = useRef<THREE.Group>(null)
  const holoRef = useRef<THREE.ShaderMaterial>(null)

  const [springs, api] = useSpring(
    () => ({ y: 0, config: { mass: 1, tension: 140, friction: 16 } }),
    [],
  )

  const [frontTexture, backTexture, noiseTexture] = useTexture([
    '/textures/charizard-front.jpg',
    '/textures/charizard-back.jpg',
    '/textures/noise.png',
  ])

  const preparedFrontTexture = useMemo(() => {
    frontTexture.colorSpace = THREE.SRGBColorSpace
    frontTexture.needsUpdate = true
    return frontTexture
  }, [frontTexture])

  useEffect(() => {
    noiseTexture.wrapS = THREE.RepeatWrapping
    noiseTexture.wrapT = THREE.RepeatWrapping
    noiseTexture.colorSpace = THREE.NoColorSpace
    noiseTexture.magFilter = THREE.LinearFilter
    noiseTexture.minFilter = THREE.LinearMipmapLinearFilter
  }, [noiseTexture])

  useFrame(() => {
    const t = scrollState.global

    if (groupRef.current) {
      const flip = Math.min(1, Math.max(0, t / 0.05))
      groupRef.current.rotation.y = Math.PI * (1 - easeInOut(flip))
    }

    const slideRange = SLIDE_END - SLIDE_START
    const slideRaw = slideRange > 0 ? (t - SLIDE_START) / slideRange : 0
    const slideT = Math.min(1, Math.max(0, slideRaw))
    api.start({ y: easeInOut(slideT) * CARD_REST_Y })

    if (holoRef.current) {
      const sweepRange = SWEEP_END - SWEEP_START
      const sweepRaw = sweepRange > 0 ? (t - SWEEP_START) / sweepRange : 0
      const inSweep = sweepRaw >= 0 && sweepRaw <= 1
      const offset = holoRef.current.uniforms.uSweepOffset.value as THREE.Vector2
      if (inSweep) {
        offset.x = -0.8 + 1.6 * sweepRaw
        offset.y = 0.5 - 1.0 * sweepRaw
        holoRef.current.uniforms.uShimmerIntensity.value = 2.2
      } else {
        offset.x = 0
        offset.y = 0
        holoRef.current.uniforms.uShimmerIntensity.value = 1.0
      }
    }
  })

  const edgeMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#0a0a0a', roughness: 0.9 }),
    [],
  )

  const backMaterial = useMemo(() => {
    backTexture.colorSpace = THREE.SRGBColorSpace
    backTexture.needsUpdate = true
    const mat = new THREE.MeshStandardMaterial({
      map: backTexture,
      roughness: 0.6,
      metalness: 0.0,
    })
    mat.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <clipping_planes_fragment>',
        `#include <clipping_planes_fragment>
        {
          vec2 cardSize = vec2(2.5, 3.5);
          float cornerRadius = 0.18;
          vec2 pos = (vMapUv - 0.5) * cardSize;
          vec2 d = abs(pos) - (cardSize * 0.5 - cornerRadius);
          if (length(max(d, 0.0)) - cornerRadius > 0.0) discard;
        }`,
      )
    }
    return mat
  }, [backTexture])

  return (
    <animated.group position-y={springs.y}>
      <group ref={groupRef}>
        <mesh>
          <boxGeometry args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]} />
          <primitive object={edgeMaterial} attach="material-0" />
          <primitive object={edgeMaterial} attach="material-1" />
          <primitive object={edgeMaterial} attach="material-2" />
          <primitive object={edgeMaterial} attach="material-3" />
          <holoMaterial
            ref={holoRef}
            attach="material-4"
            toneMapped={false}
            uTexture={preparedFrontTexture}
            uNoiseTexture={noiseTexture}
            uLightDir={LIGHT_DIR}
          />
          <primitive object={backMaterial} attach="material-5" />
        </mesh>
      </group>
    </animated.group>
  )
}
