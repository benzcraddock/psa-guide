'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import Card from './Card'
import CameraRig from './CameraRig'

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 35 }}
      gl={{ antialias: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[-1.5, 3.5, 3]} intensity={1.4} />
      <Suspense fallback={null}>
        <Environment preset="studio" environmentIntensity={0.15} />
        <Card />
      </Suspense>
      <CameraRig />
    </Canvas>
  )
}
