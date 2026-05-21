'use client'

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../Scroll/scrollState'
import { waypoints } from '@/lib/waypoints'

export default function CameraRig() {
  const { camera } = useThree()

  const positionCurve = useMemo(() => {
    const points = waypoints.map((w) => new THREE.Vector3(...w.position))
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5)
  }, [])

  const lookAtTarget = useRef(new THREE.Vector3())
  const tmpA = useRef(new THREE.Vector3())
  const tmpB = useRef(new THREE.Vector3())

  useFrame(() => {
    const t = scrollState.global
    const segments = waypoints.length - 1

    let i = 0
    while (i < segments && t > waypoints[i + 1].scrollAt) i++

    const w0 = waypoints[i]
    const w1 = waypoints[Math.min(i + 1, segments)]
    const span = w1.scrollAt - w0.scrollAt
    const localT = span > 0 ? (t - w0.scrollAt) / span : 0
    const clamped = Math.min(1, Math.max(0, localT))
    const eased = w0.easing ? w0.easing(clamped) : clamped

    const curveT = Math.min(1, Math.max(0, (i + eased) / segments))
    camera.position.copy(positionCurve.getPoint(curveT))

    tmpA.current.set(...w0.lookAt)
    tmpB.current.set(...w1.lookAt)
    lookAtTarget.current.copy(tmpA.current).lerp(tmpB.current, eased)
    camera.lookAt(lookAtTarget.current)

    const fov = w0.fov + (w1.fov - w0.fov) * eased
    if ('fov' in camera && camera.fov !== fov) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
  })

  return null
}
