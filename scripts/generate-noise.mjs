import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PNG } from 'pngjs'
import { createNoise2D } from 'simplex-noise'

const SIZE = 512
const OCTAVES = 4
const PERSISTENCE = 0.5
const LACUNARITY = 2.0
const BASE_FREQUENCY = 8

const SEED = 'psa-guide/charizard-holo-scintillation'

function mulberry32(seed) {
  let a = 0
  for (let i = 0; i < seed.length; i++) a = (a * 31 + seed.charCodeAt(i)) | 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rng = mulberry32(SEED)
const noise2D = createNoise2D(rng)

const png = new PNG({ width: SIZE, height: SIZE, colorType: 0 })

let min = Infinity
let max = -Infinity
const raw = new Float32Array(SIZE * SIZE)

for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    let amplitude = 1
    let frequency = BASE_FREQUENCY
    let value = 0
    let normalizer = 0
    for (let o = 0; o < OCTAVES; o++) {
      const nx = (x / SIZE) * frequency
      const ny = (y / SIZE) * frequency
      value += noise2D(nx, ny) * amplitude
      normalizer += amplitude
      amplitude *= PERSISTENCE
      frequency *= LACUNARITY
    }
    value /= normalizer
    raw[y * SIZE + x] = value
    if (value < min) min = value
    if (value > max) max = value
  }
}

const range = max - min || 1
for (let i = 0; i < raw.length; i++) {
  const normalized = (raw[i] - min) / range
  const v = Math.round(normalized * 255)
  const idx = i * 4
  png.data[idx] = v
  png.data[idx + 1] = v
  png.data[idx + 2] = v
  png.data[idx + 3] = 255
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = resolve(__dirname, '..', 'public', 'textures', 'noise.png')

writeFileSync(outPath, PNG.sync.write(png))
console.log(`Wrote ${SIZE}x${SIZE} noise to ${outPath}`)
