import { beats, type Beat } from '@/lib/beats'

export interface ScrollSnapshot {
  global: number
  beatLocal: number
  activeBeat: Beat
}

export const scrollState: ScrollSnapshot = {
  global: 0,
  beatLocal: 0,
  activeBeat: beats[0],
}

export function setScrollProgress(global: number) {
  const clamped = Math.min(1, Math.max(0, global))
  const beat =
    beats.find((b) => clamped >= b.scrollStart && clamped < b.scrollEnd) ??
    beats[beats.length - 1]
  const span = beat.scrollEnd - beat.scrollStart
  scrollState.global = clamped
  scrollState.activeBeat = beat
  scrollState.beatLocal = span > 0 ? (clamped - beat.scrollStart) / span : 0
}
