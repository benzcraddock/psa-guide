'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

const SHADOW_Y = -3.9
const SHADOW_RADIUS = 2.4

function makeRadialAlphaTexture(): THREE.Texture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  )
  gradient.addColorStop(0, 'rgba(0,0,0,0.55)')
  gradient.addColorStop(0.55, 'rgba(0,0,0,0.18)')
  gradient.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export default function GroundShadow() {
  const texture = useMemo(makeRadialAlphaTexture, [])

  return (
    <mesh position={[0, SHADOW_Y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[SHADOW_RADIUS * 2, SHADOW_RADIUS * 2]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        color="#000000"
      />
    </mesh>
  )
}
