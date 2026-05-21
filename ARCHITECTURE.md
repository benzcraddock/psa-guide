# Technical Architecture

## Stack (locked)

- **Next.js 15** App Router, TypeScript
- **React Three Fiber** + **@react-three/drei**
- **GSAP** + **ScrollTrigger** (`@gsap/react` for `useGSAP` hook)
- **@react-spring/three** for card physics feel
- **Tailwind CSS** for the 2D UI overlay (text, step indicators)
- **Vercel** for hosting

## Mental model

The entire site is **one continuous 3D scene + one fixed video element + one scroll-driven 2D text overlay.**

- **3D scene** runs always, but the camera waypoints + scene contents change based on scroll position
- **Video element** is hidden during 3D beats, visible (and scrubbed by scroll) during video beats
- **Text overlay** is pinned to the viewport, content swaps based on which beat is active

```
┌──────────────────────────────────────┐
│  <html>                              │
│    <body>                            │
│      <main> (scroll container)       │
│        <ScrollSpacer />              │ ← creates scroll height
│        <FixedStage> (sticky pinned)  │
│          <Canvas> (R3F)              │
│            <Scene />                 │
│          </Canvas>                   │
│          <VideoLayer />              │
│          <TextOverlay />             │
│        </FixedStage>                 │
│      </main>                         │
│    </body>                           │
│  </html>                             │
└──────────────────────────────────────┘
```

## File structure (proposed)

```
psa-shipguide/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Main scroll experience
│   └── globals.css
├── components/
│   ├── Stage.tsx                   # Top-level sticky stage container
│   ├── Scene/
│   │   ├── Scene.tsx               # R3F scene root
│   │   ├── Card.tsx                # Charizard card with holo shader
│   │   ├── HoloMaterial.tsx        # Custom shader material
│   │   ├── Sleeve.tsx
│   │   ├── SemiRigid.tsx
│   │   ├── TeamBag.tsx
│   │   ├── Cardboard.tsx
│   │   ├── Studio.tsx              # Lighting, background, environment
│   │   └── CameraRig.tsx           # Scroll-driven camera controller
│   ├── Video/
│   │   └── VideoLayer.tsx          # Single video element, scrubbed
│   ├── Text/
│   │   ├── TextOverlay.tsx         # The fixed text layer
│   │   └── StepCopy.ts             # Copy bible as data
│   └── Scroll/
│       ├── ScrollProvider.tsx      # GSAP ScrollTrigger setup
│       └── useScrollProgress.ts    # Hook to get current scroll T (0–1)
├── lib/
│   ├── beats.ts                    # The beat definitions (timing, mode, copy)
│   ├── easings.ts                  # Custom easing functions
│   └── waypoints.ts                # Camera waypoint definitions
├── public/
│   ├── textures/
│   │   ├── charizard-front.jpg     # The SIR JPEG
│   │   ├── charizard-back.jpg      # Pokémon card back
│   │   ├── foil-mask.png           # Hand-painted in Phase 2
│   │   ├── cardboard.jpg           # Cardboard texture
│   │   └── noise.png               # Pre-baked scintillation noise
│   ├── videos/
│   │   ├── 05-print.mp4
│   │   ├── 06-assemble.mp4
│   │   ├── 07-form-in-box.mp4
│   │   ├── 08-seal.mp4
│   │   ├── 09a-scissors.mp4
│   │   ├── 09b-label-apply.mp4
│   │   └── 10-handoff.mp4
│   └── hdri/
│       └── studio.hdr              # Environment lighting
├── reference/                       # Source reference materials (not shipped)
│   ├── charizard-sir-real.jpg      # Photo of the real card
│   ├── shopify-design-screenshot.png
│   └── psa-original.png
├── PRD.md
├── STORYBOARD.md
├── SHADER_SPEC.md
├── ARCHITECTURE.md                  # This file
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Key abstractions

### `beats.ts` — the source of truth

```typescript
export interface Beat {
  id: string
  scrollStart: number  // 0-1
  scrollEnd: number    // 0-1
  mode: '3d' | 'video' | 'transition'
  videoSrc?: string
  copy: { num: string; title: string; body: string }
  cameraWaypoint?: CameraWaypoint  // for 3D beats only
}

export const beats: Beat[] = [
  { id: 'cold-open', scrollStart: 0, scrollEnd: 0.05, mode: '3d', /* ... */ },
  { id: 'sleeve', scrollStart: 0.05, scrollEnd: 0.15, mode: '3d', /* ... */ },
  // ... etc
]
```

Every component that needs to know "what beat are we in" reads from this single source. Want to retime the whole experience? Adjust the numbers here.

### `useScrollProgress` hook

```typescript
export function useScrollProgress(): {
  global: number;          // 0-1 across entire experience
  beatLocal: number;       // 0-1 within current beat
  activeBeat: Beat;
}
```

GSAP's ScrollTrigger drives this. Everything else (camera, text fades, video time) derives from these three values.

### `CameraRig` — the choreographer

The camera is NEVER moved by user input (no OrbitControls). It's driven entirely by scroll position interpolating between defined waypoints. Each waypoint specifies:

```typescript
interface CameraWaypoint {
  position: [number, number, number]
  lookAt: [number, number, number]
  fov: number
  easing: (t: number) => number
}
```

For card-attached camera moves (orbits, dollies), use `THREE.CatmullRomCurve3` between waypoints for smooth paths.

### `VideoLayer` — the scrub strategy

For each video beat, we use a single HTML5 `<video>` element with `preload="auto"`, set `currentTime` directly from scroll position. This works well for short clips (under 10s) at reasonable resolution.

**Critical:** All videos must be encoded with frequent keyframes (every 1-2 frames) for smooth scrubbing. Use ffmpeg pre-process:

```bash
ffmpeg -i input.mp4 -c:v libx264 -x264opts keyint=1 -crf 22 output.mp4
```

## Performance budget

- Target: 60fps on M-series MacBook
- 3D triangle count: under 50k total in scene
- Texture memory: under 100MB total
- Each video clip: under 5MB compressed
- Total page weight: under 50MB

## Build order (recommended for vibe-coding sessions)

### Session 1 — Scaffold + scroll
Get Next.js + R3F + GSAP set up. Empty scene. Scroll moves a placeholder cube. Validate the pipeline.

### Session 2 — Card + holo shader
Render the Charizard with the holo shader. Add OrbitControls *temporarily* to verify the shader looks right at every angle. Phase 1 of `SHADER_SPEC.md`.

### Session 3 — Camera rig + waypoints
Replace OrbitControls with scroll-driven camera. Define first 2 waypoints. Get the card rotating with scroll.

### Session 4 — Sleeve + Beat 01
Build the sleeve mesh. Animate card sliding in via spring. This is the first complete beat.

### Session 5 — Beats 02–04
Repeat the pattern for semi-rigid, team bag, cardboard. Should be much faster since the foundation is set.

### Session 6 — Text overlay + step UI
Add the 2D text layer. Beat copy fades in/out with scroll.

### Session 7 — Video layer
Wire up the video element with scroll scrubbing. Test with placeholder clips first.

### Session 8 — Transition + match cut
The 3D-to-video handoff at the 50% mark.

### Session 9 — Polish + loop
Final tuning, the loop ending, postprocessing if needed.

### Session 10 — Mobile pass + deploy
Adaptive layout, deploy to Vercel.

## Things to NOT do

- Don't use real physics (rapier, cannon). Springs are enough.
- Don't try to load the videos in the 3D scene as VideoTextures. They go in a separate DOM element above the canvas.
- Don't add user interaction (drag, click). Scroll is the only input.
- Don't add a navigation menu / "jump to step X". Scroll is the experience.
- Don't preload all videos at once. Lazy-load based on scroll proximity.
- Don't put 3D models in Blender if you can code them. We are coding shapes, not modeling them.
