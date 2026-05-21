export type BeatMode = '3d' | 'video' | 'transition'

export interface Beat {
  id: string
  scrollStart: number
  scrollEnd: number
  mode: BeatMode
  copy: { num: string; title: string; body: string }
}

export const beats: Beat[] = [
  {
    id: 'cold-open',
    scrollStart: 0,
    scrollEnd: 0.05,
    mode: '3d',
    copy: {
      num: '00',
      title: 'How to ship a card to PSA.',
      body: 'An immersive walkthrough.',
    },
  },
  {
    id: 'sleeve',
    scrollStart: 0.05,
    scrollEnd: 0.15,
    mode: '3d',
    copy: {
      num: '01',
      title: 'Sleeve your card.',
      body: 'Penny sleeve, opening facing up. Slide slowly. The holo deserves it.',
    },
  },
]
