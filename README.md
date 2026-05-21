# PSA Shipping Guide — Project Bible

This folder contains the complete handoff package for building the immersive PSA shipping guide. Drop these `.md` files into your project repo before opening Claude Code.

## What's in here

| File | What it is | When to read |
|---|---|---|
| `PRD.md` | The product requirements doc. What we're building, why, scope, risks, success criteria. | Read first. Sets context for everything else. |
| `STORYBOARD.md` | The 10-beat scroll choreography with shot lists, camera moves, Higgsfield prompts, and the copy bible. | Read second. The creative brief. |
| `SHADER_SPEC.md` | Technical spec for the holographic card material. Includes a starting R3F shader skeleton. | Read when building the Charizard card (Session 2). |
| `ARCHITECTURE.md` | Codebase structure, file layout, build order across 10 sessions. | Read before writing any code. |
| `CLAUDE_CODE_KICKOFF.md` | The exact prompt to paste into Claude Code as your first message. | Use when you open Claude Code. |
| `reference/` | Photo of the real Mega Charizard X SIR under light, plus screenshots of shopify.design and the original PSA page. | Reference material the shader should be tuned against. |

## How to use this package

1. **Create your project folder.** Something like `~/code/psa-shipguide/`.
2. **Copy these `.md` files into the root of that folder.**
3. **Create a `reference/` subfolder** and drop in:
   - The photo of the real card under light
   - A screenshot or two of shopify.design
   - The PSA original page screenshot
4. **Open the folder in Claude Code** (`claude` from the terminal in that folder).
5. **Paste the contents of `CLAUDE_CODE_KICKOFF.md`** as your first message.
6. **Build session by session** following the order in `ARCHITECTURE.md`.

## What's NOT in here (intentionally)

- No code. Claude Code will write the code with you, not from a template.
- No Higgsfield prompts in a separate doc — they live inside `STORYBOARD.md` next to the beats they belong to.
- No design system / color palette doc. The visual language is described in prose in `STORYBOARD.md` and refined as we build.
- No asset list with download links. The Charizard JPEG and any other reference images go in `/reference/` manually.

## Open questions that became answers (for the record)

- **Card art:** Mega Charizard X EX SIR, Phantasmal Flames 125/094
- **Holo shader:** Two-phase approach. Phase 1 ships with the build. Phase 2 (hand-painted normal map + foil mask) is post-launch polish.
- **Soul Character (Higgsfield hands):** Train via Higgsfield using a coherent generated reference set. Use across all 6 video shots.
- **End card:** Loop back to step 1 via slabbed card → bare card dissolve.
- **Mobile:** Deferred. Likely a vertical-video fallback. Not blocking v1.
- **Hosting:** Vercel.

## What success looks like at the end

You scroll through the site, see a Mega Charizard X SIR catch the light in 3D, watch it get packaged and shipped, and at the end you can't quite tell where the 3D ended and the video began. The whole thing loops, and you scroll back up just to watch the holo move again.
