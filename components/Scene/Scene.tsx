'use client'

import { Canvas } from '@react-three/fiber'
import PlaceholderCube from './PlaceholderCube'

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <PlaceholderCube />
    </Canvas>
  )
}
