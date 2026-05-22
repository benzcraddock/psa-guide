'use client'

import Scene from './Scene/Scene'

export default function Stage() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse at center, #0a0a14 0%, #000000 75%)',
      }}
    >
      <Scene />
    </div>
  )
}
