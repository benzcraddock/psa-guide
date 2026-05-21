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
  {
    id: 'semi-rigid',
    scrollStart: 0.15,
    scrollEnd: 0.25,
    mode: '3d',
    copy: {
      num: '02',
      title: 'Into the semi-rigid.',
      body: 'Card-Saver I or equivalent. Snug, never forced.',
    },
  },
  {
    id: 'team-bag',
    scrollStart: 0.25,
    scrollEnd: 0.35,
    mode: '3d',
    copy: {
      num: '03',
      title: 'Team bag it.',
      body: 'Optional, but recommended. Moisture is the enemy.',
    },
  },
  {
    id: 'cardboard',
    scrollStart: 0.35,
    scrollEnd: 0.45,
    mode: '3d',
    copy: {
      num: '04',
      title: 'Cardboard sandwich.',
      body: 'Two pieces, slightly larger than the card. Protection from every angle.',
    },
  },
]
