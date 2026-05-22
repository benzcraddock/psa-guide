'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../Scroll/scrollState'
import { easeOut } from '@/lib/easings'

const Y_CENTER = -1.0
const STACK_HEIGHT = 5.6

const CARDBOARD_HALF_WIDTH = 1.85
const CARDBOARD_FRONT_Z = 0.205

const BAND_HALF_THICK = 0.009
const BAND_HALF_WIDE = 0.08
const BAND_SURFACE_GAP = 0.005

const BAND_HALF_WIDTH = CARDBOARD_HALF_WIDTH + BAND_HALF_THICK + BAND_SURFACE_GAP
const BAND_HALF_DEPTH = CARDBOARD_FRONT_Z + BAND_HALF_THICK + BAND_SURFACE_GAP

const REST_SCALE = 1.0
const LOOSE_SCALE = 1.2

const FLY_IN_OFFSET = 6.0

const FLY_IN_START = 0.45
const FLY_IN_END = 0.49
const GRIP_START = 0.48
const GRIP_END = 0.50

const TUBULAR_SEGMENTS = 192

interface BandSpec {
  yOffset: number
  tiltDeg: number
}

const BANDS: BandSpec[] = [
  { yOffset: 0.20, tiltDeg: 2 },
  { yOffset: 0.45, tiltDeg: -2 },
  { yOffset: 0.70, tiltDeg: 1.5 },
]

function makeBandCurve(): THREE.CatmullRomCurve3 {
  const points = [
    new THREE.Vector3(BAND_HALF_WIDTH, 0, BAND_HALF_DEPTH),
    new THREE.Vector3(BAND_HALF_WIDTH * 0.5, 0, BAND_HALF_DEPTH),
    new THREE.Vector3(-BAND_HALF_WIDTH * 0.5, 0, BAND_HALF_DEPTH),
    new THREE.Vector3(-BAND_HALF_WIDTH, 0, BAND_HALF_DEPTH),
    new THREE.Vector3(-BAND_HALF_WIDTH, 0, -BAND_HALF_DEPTH),
    new THREE.Vector3(-BAND_HALF_WIDTH * 0.5, 0, -BAND_HALF_DEPTH),
    new THREE.Vector3(BAND_HALF_WIDTH * 0.5, 0, -BAND_HALF_DEPTH),
    new THREE.Vector3(BAND_HALF_WIDTH, 0, -BAND_HALF_DEPTH),
  ]
  return new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.5)
}

function makeFlatBandGeometry(): THREE.BufferGeometry {
  const curve = makeBandCurve()
  const positions: number[] = []
  const indices: number[] = []

  for (let i = 0; i < TUBULAR_SEGMENTS; i++) {
    const u = i / TUBULAR_SEGMENTS
    const point = curve.getPointAt(u)
    const tangent = curve.getTangentAt(u).normalize()

    const outX = tangent.z
    const outZ = -tangent.x

    const corners: [number, number][] = [
      [-BAND_HALF_THICK, -BAND_HALF_WIDE],
      [+BAND_HALF_THICK, -BAND_HALF_WIDE],
      [+BAND_HALF_THICK, +BAND_HALF_WIDE],
      [-BAND_HALF_THICK, +BAND_HALF_WIDE],
    ]

    for (const [r, v] of corners) {
      positions.push(point.x + outX * r, point.y + v, point.z + outZ * r)
    }
  }

  for (let i = 0; i < TUBULAR_SEGMENTS; i++) {
    const nextI = (i + 1) % TUBULAR_SEGMENTS
    const a = i * 4
    const b = nextI * 4

    for (let j = 0; j < 4; j++) {
      const nextJ = (j + 1) % 4
      indices.push(a + j, b + j, b + nextJ)
      indices.push(a + j, b + nextJ, a + nextJ)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  )
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
}

function Band({ yOffset, tiltDeg }: BandSpec) {
  const meshRef = useRef<THREE.Mesh>(null)
  const restY = Y_CENTER - STACK_HEIGHT / 2 + STACK_HEIGHT * yOffset

  const geometry = useMemo(() => makeFlatBandGeometry(), [])

  useFrame(() => {
    if (!meshRef.current) return
    const t = scrollState.global

    const flyRange = FLY_IN_END - FLY_IN_START
    const flyRaw = flyRange > 0 ? (t - FLY_IN_START) / flyRange : 0
    const flyT = Math.min(1, Math.max(0, flyRaw))
    const flyEased = easeOut(flyT)
    const yStart = restY + FLY_IN_OFFSET
    meshRef.current.position.y = yStart + (restY - yStart) * flyEased

    const gripRange = GRIP_END - GRIP_START
    const gripRaw = gripRange > 0 ? (t - GRIP_START) / gripRange : 0
    const gripT = Math.min(1, Math.max(0, gripRaw))
    const gripEased = easeOut(gripT)
    const s = LOOSE_SCALE + (REST_SCALE - LOOSE_SCALE) * gripEased
    meshRef.current.scale.set(s, 1, s)

    meshRef.current.visible = flyT > 0
  })

  return (
    <mesh
      ref={meshRef}
      position={[0, restY + FLY_IN_OFFSET, 0]}
      rotation={[(tiltDeg * Math.PI) / 180, 0, 0]}
      geometry={geometry}
    >
      <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0} />
    </mesh>
  )
}

export default function RubberBands() {
  return (
    <>
      {BANDS.map((band, i) => (
        <Band key={i} yOffset={band.yOffset} tiltDeg={band.tiltDeg} />
      ))}
    </>
  )
}
