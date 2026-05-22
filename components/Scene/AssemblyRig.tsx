'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../Scroll/scrollState'
import { easeInOut } from '@/lib/easings'
import Card from './Card'
import Cardboard from './Cardboard'
import RubberBands from './RubberBands'
import SemiRigid from './SemiRigid'
import Sleeve from './Sleeve'

const ROTATE_START = 0.35
const ROTATE_END = 0.45
const ROTATE_MAX = Math.PI / 3.5

const MOUSE_TILT_Y = 0.09
const MOUSE_TILT_X = 0.05
const MOUSE_LERP = 0.08

export default function AssemblyRig() {
  const ref = useRef<THREE.Group>(null)
  const { pointer } = useThree()

  useFrame(() => {
    if (!ref.current) return
    const t = scrollState.global

    const range = ROTATE_END - ROTATE_START
    const raw = range > 0 ? (t - ROTATE_START) / range : 0
    const clamped = Math.min(1, Math.max(0, raw))
    const scrollRotY = easeInOut(clamped) * ROTATE_MAX

    const targetRotY = scrollRotY + pointer.x * MOUSE_TILT_Y
    const targetRotX = -pointer.y * MOUSE_TILT_X

    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      targetRotY,
      MOUSE_LERP,
    )
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      targetRotX,
      MOUSE_LERP,
    )
  })

  return (
    <group ref={ref}>
      <Cardboard />
      <RubberBands />
      <SemiRigid />
      <Sleeve />
      <Card />
    </group>
  )
}
