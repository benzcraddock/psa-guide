'use client'

import WaterfallCard from './WaterfallCard'

interface WaterfallEntry {
  frontTextureUrl: string
  dropStart: number
  dropEnd: number
  zOffset: number
  restY: number
  side: 'left' | 'right'
  renderOrderBase: number
  // Atmospheric tint: cards further back read darker/cooler so they recede.
  tint: string
}

const WATERFALL_CARDS: WaterfallEntry[] = [
  {
    frontTextureUrl: '/textures/pikachu-front.jpg',
    dropStart: 0.35,
    dropEnd: 0.40,
    zOffset: -0.06,
    restY: -0.92,
    side: 'left',
    renderOrderBase: 8,
    tint: '#cccdd4',
    // tightly stacked just behind Charizard, inside the cardboard cavity
  },
  {
    frontTextureUrl: '/textures/gengar-front.jpeg',
    dropStart: 0.383,
    dropEnd: 0.433,
    zOffset: -0.10,
    restY: -0.84,
    side: 'right',
    renderOrderBase: 6,
    tint: '#abaeb8',
  },
  {
    frontTextureUrl: '/textures/mew-front.jpg',
    dropStart: 0.416,
    dropEnd: 0.466,
    zOffset: -0.14,
    restY: -0.76,
    side: 'left',
    renderOrderBase: 4,
    tint: '#8b8f9a',
  },
  {
    frontTextureUrl: '/textures/umbreon-front.jpeg',
    dropStart: 0.45,
    dropEnd: 0.50,
    zOffset: -0.18,
    restY: -0.68,
    side: 'right',
    renderOrderBase: 2,
    tint: '#73767f',
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
          restY={card.restY}
          side={card.side}
          renderOrderBase={card.renderOrderBase}
          tint={card.tint}
        />
      ))}
    </>
  )
}
