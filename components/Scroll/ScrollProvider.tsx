'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setScrollProgress } from './scrollState'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => setScrollProgress(self.progress),
    })
    return () => {
      trigger.kill()
    }
  }, [])

  return <>{children}</>
}
