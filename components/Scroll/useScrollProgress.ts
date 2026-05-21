'use client'

import { useEffect, useState } from 'react'
import { scrollState, type ScrollSnapshot } from './scrollState'

export function useScrollProgress(): ScrollSnapshot {
  const [snap, setSnap] = useState<ScrollSnapshot>({ ...scrollState })

  useEffect(() => {
    let raf = 0
    const tick = () => {
      setSnap({ ...scrollState })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return snap
}
