'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useTexture } from '@react-three/drei'
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

export default function Card() {
  const groupRef = useRef<THREE.Group>(null)

  const [frontTexture, backTexture, noiseTexture] = useTexture([
    '/textures/charizard-front.jpg',
    '/textures/charizard-back.jpg',
    '/textures/noise.png',
  ])

  useEffect(() => {
    frontTexture.colorSpace = THREE.SRGBColorSpace
    backTexture.colorSpace = THREE.SRGBColorSpace
    noiseTexture.wrapS = THREE.RepeatWrapping
    noiseTexture.wrapT = THREE.RepeatWrapping
    noiseTexture.colorSpace = THREE.NoColorSpace
    noiseTexture.magFilter = THREE.LinearFilter
    noiseTexture.minFilter = THREE.LinearMipmapLinearFilter
  }, [frontTexture, backTexture, noiseTexture])

  useFrame(() => {
    if (!groupRef.current) return
    const flip = Math.min(1, Math.max(0, scrollState.global / 0.05))
    groupRef.current.rotation.y = Math.PI * (1 - easeInOut(flip))
  })

  const edgeMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#0a0a0a', roughness: 0.9 }),
    [],
  )

  const backMaterial = useMemo(() => {
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
    <group ref={groupRef}>
      <mesh>
        <boxGeometry args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]} />
        <primitive object={edgeMaterial} attach="material-0" />
        <primitive object={edgeMaterial} attach="material-1" />
        <primitive object={edgeMaterial} attach="material-2" />
        <primitive object={edgeMaterial} attach="material-3" />
        <holoMaterial
          attach="material-4"
          uTexture={frontTexture}
          uNoiseTexture={noiseTexture}
          uLightDir={LIGHT_DIR}
        />
        <primitive object={backMaterial} attach="material-5" />
      </mesh>
    </group>
  )
}
