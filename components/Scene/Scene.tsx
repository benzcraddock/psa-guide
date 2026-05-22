'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import AssemblyRig from './AssemblyRig'
import CameraRig from './CameraRig'
import GroundShadow from './GroundShadow'
import ParticleField from './ParticleField'

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8.5], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[-1.5, 3.5, 3]} intensity={2.0} />
      <Suspense fallback={null}>
        <Environment preset="studio" environmentIntensity={0.15} />
        <ParticleField />
        <GroundShadow />
        <AssemblyRig />
      </Suspense>
      <CameraRig />
    </Canvas>
  )
}
