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
    scrollEnd: 0.21,
    mode: '3d',
    copy: {
      num: '01',
      title: 'Sleeve your card.',
      body: 'Penny sleeve, opening facing up. Slide slowly. The holo deserves it.',
    },
  },
  {
    id: 'semi-rigid',
    scrollStart: 0.21,
    scrollEnd: 0.35,
    mode: '3d',
    copy: {
      num: '02',
      title: 'Into the semi-rigid.',
      body: 'Card-Saver I or equivalent. Snug, never forced.',
    },
  },
  {
    id: 'waterfall',
    scrollStart: 0.35,
    scrollEnd: 0.40,
    mode: '3d',
    copy: {
      num: '03.5',
      title: 'Stack the rest.',
      body: 'Same care, every card. Multiple submissions stack together, each one sleeved and saved.',
    },
  },
  {
    id: 'cardboard',
    scrollStart: 0.40,
    scrollEnd: 0.45,
    mode: '3d',
    copy: {
      num: '04',
      title: 'Cardboard sandwich.',
      body: 'Two pieces, slightly larger than the card. Protection from every angle.',
    },
  },
  {
    id: 'rubber-bands',
    scrollStart: 0.45,
    scrollEnd: 0.50,
    mode: '3d',
    copy: {
      num: '04.5',
      title: 'Bind with rubber bands.',
      body: 'Three bands, perpendicular to the card. Compression locks the sandwich.',
    },
  },
]
