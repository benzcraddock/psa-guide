'use client'

import WaterfallCard from './WaterfallCard'

interface WaterfallEntry {
  frontTextureUrl: string
  dropStart: number
  dropEnd: number
  zOffset: number
  side: 'left' | 'right'
  renderOrderBase: number
}

const WATERFALL_CARDS: WaterfallEntry[] = [
  {
    frontTextureUrl: '/textures/pikachu-front.jpg',
    dropStart: 0.35,
    dropEnd: 0.362,
    zOffset: -0.04,
    side: 'left',
    renderOrderBase: 8,
  },
  {
    frontTextureUrl: '/textures/gengar-front.jpeg',
    dropStart: 0.362,
    dropEnd: 0.374,
    zOffset: -0.08,
    side: 'right',
    renderOrderBase: 6,
  },
  {
    frontTextureUrl: '/textures/mew-front.jpg',
    dropStart: 0.374,
    dropEnd: 0.386,
    zOffset: -0.12,
    side: 'left',
    renderOrderBase: 4,
  },
  {
    frontTextureUrl: '/textures/umbreon-front.jpeg',
    dropStart: 0.386,
    dropEnd: 0.398,
    zOffset: -0.16,
    side: 'right',
    renderOrderBase: 2,
  },
]

export default function Waterfall() {
  return (
    <>
      {WATERFALL_CARDS.map((card) => (
        <WaterfallCard
          key={card.frontTextureUrl}
          frontTextureUrl={card.frontTextureUrl}
          dropStart={card.dropStart}
          dropEnd={card.dropEnd}
          zOffset={card.zOffset}
          side={card.side}
          renderOrderBase={card.renderOrderBase}
        />
      ))}
    </>
  )
}
