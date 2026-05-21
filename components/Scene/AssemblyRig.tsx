'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../Scroll/scrollState'
import { easeInOut } from '@/lib/easings'
import Card from './Card'
import Cardboard from './Cardboard'
import SemiRigid from './SemiRigid'
import Sleeve from './Sleeve'
import TeamBag from './TeamBag'

const ROTATE_START = 0.35
const ROTATE_END = 0.45
const ROTATE_MAX = Math.PI / 3.5

export default function AssemblyRig() {
  const ref = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!ref.current) return
    const t = scrollState.global
    const range = ROTATE_END - ROTATE_START
    const raw = range > 0 ? (t - ROTATE_START) / range : 0
    const clamped = Math.min(1, Math.max(0, raw))
    ref.current.rotation.y = easeInOut(clamped) * ROTATE_MAX
  })

  return (
    <group ref={ref}>
      <Cardboard />
      <TeamBag />
      <SemiRigid />
      <Sleeve />
      <Card />
    </group>
  )
}
