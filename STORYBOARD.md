# Storyboard v2

**Status:** Locked for v1 build
**Card:** Mega Charizard X EX SIR (Phantasmal Flames 125/094)
**Total beats:** 10 steps + transition + loop
**Estimated scroll length:** ~6000-8000 vh (3-4 min at natural scroll pace)

---

## Structural arc

**Act 1 — The Laboratory (Steps 1–4)**
3D-driven. Dark studio void. Intimate camera. Card and protection materials feel weightless, precise. Holo shader catches light on every rotation.

**Transition — The Pull-Back**
Camera dollies way out from the assembled card. Reveals a hand reaching in. Match cut into the video world.

**Act 2 — The Studio (Steps 5–7)**
Video-driven. Hands, real materials, real motion. Clean lighting. Submission form, box assembly, form placement.

**Act 3 — The Send-Off (Steps 8–10)**
Video-driven, more cinematic. Tape, label cut, label apply, courier handoff. Closes with the box leaving frame.

**Loop — The Return**
Match cut from the box leaving frame to a slabbed/graded PSA case briefly catching the camera, then dissolving back into the bare Charizard hovering in the void. Scroll returns to top. (Implementation: virtual scroll reset, not a forced jump — the user can scroll back up naturally, but the visual loop completes the cycle.)

---

## Beat-by-beat shot list

### Beat 00 — Title / Cold open
**Technique:** 3D
**Camera:** Black screen. Subtle ambient blue. Mega Charizard X card hovers face-down (showing standard Pokémon back) center frame, very slow rotation. Title sets: "How to ship a card to PSA." Then: "An immersive walkthrough." Card begins to flip toward camera.
**Copy:** Title sequence only. Step copy starts at Beat 01.
**Scroll range:** 0–5%

### Beat 01 — Sleeve your card
**Technique:** 3D
**Camera:** Card completes its flip — first reveal of the holo face. Camera holds for 2 beats. Then dives in to extreme close-up of the card edge. Penny sleeve fades in below, card descends and slides in. Camera circles 90° to show the fit from the side.
**Physics:** Card has slight wobble entering sleeve, settles with damped spring. Holo shader at full intensity during the reveal — this is the moment.
**Copy:** "Sleeve your card. Penny sleeve, opening facing up. Slide slowly — the holo deserves it."
**Scroll range:** 5–15%
**Build priority:** HERO — get this beat perfect before any other step.

### Beat 02 — Into the semi-rigid
**Technique:** 3D
**Camera:** Cut to a wider angle. Card-in-sleeve floats horizontally. Semi-rigid (Card-Saver I equivalent) slides in from frame-left. Card slips inside. Camera tilts to show snug fit through the transparent plastic. Holo shader is now slightly muted (light dispersing through the semi-rigid).
**Physics:** Semi-rigid has slight bend on insertion (vertex animation, not real physics). Card settles flush against the back wall.
**Copy:** "Into the semi-rigid. Card-Saver I or equivalent. Snug, never forced."
**Scroll range:** 15–25%

### Beat 03 — Team bag
**Technique:** 3D
**Camera:** Top-down view. Card-in-saver lays flat on dark surface. Team bag unfolds open from the top. Saver slides in. Bag flap folds over with a soft paper-like motion. Camera tilts back up to a 3/4 view as the flap seals.
**Physics:** Bag flap folds with a soft, paper-like animation. Slight flutter.
**Copy:** "Team bag it. Optional, but recommended. Moisture is the enemy."
**Scroll range:** 25–35%

### Beat 04 — Cardboard sandwich
**Technique:** 3D
**Camera:** Two cardboard pieces float in from off-screen. Card assembly settles between them. Camera circles slowly to show the sandwich structure. Final beat: assembly rotates slowly, locked together as one unit.
**Physics:** Cardboard pieces drift in with weight. A subtle "click" feeling on full assembly.
**Copy:** "Cardboard sandwich. Two pieces, slightly larger than the card. Protection from every angle."
**Scroll range:** 35–45%

### Beat T — The Pull-Back (transition)
**Technique:** 3D → Video match cut
**Camera:** Camera dollies *way* back from the sandwiched assembly. The sandwich sits on what is revealed to be a real wooden tabletop. A hand reaches in from frame-right. At the exact moment the hand enters, we cut to a Higgsfield-generated video clip where that exact frame is the first frame.
**Build note:** The trickiest beat. The 3D card must occupy the same screen position as the video card on the cut. Export a still from the 3D scene at the moment of transition; that becomes the reference frame for Higgsfield's generation.
**Fallback:** If the match cut fails, use a 200ms cross-dissolve. Less impressive but always works.
**Scroll range:** 45–50%

### Beat 05 — Print your submission form
**Technique:** Video (Higgsfield / Seedance 2.0)
**Shot:** Macro close-up of a modern office printer sliding out a sheet of paper. Form has visible "PSA SUBMISSION FORM" header. Hand picks it up.
**Higgsfield prompt:**
> Macro close-up shot of a modern office printer pushing out a single sheet of white paper. The paper has visible black text reading "PSA SUBMISSION FORM" at the top. Soft natural lighting, shallow depth of field, clean white surroundings. A human hand reaches in from frame-right and picks up the paper. Shot on Arri Alexa, 50mm lens, cinematic 24fps.

**Copy:** "Print your submission form. The paperwork makes it real."
**Scroll range:** 50–58%

### Beat 06 — Assemble the box
**Technique:** Video (Higgsfield)
**Shot:** Overhead. A flat cardboard box being folded into shape on a clean white surface. Hands working efficiently. Time-lapse feel but smooth.
**Higgsfield prompt:**
> Overhead macro shot of two hands assembling a flat cardboard shipping box on a clean white surface. The box folds up into 3D shape. Soft overhead lighting, top-down camera angle, hands move with precision. Shot on Arri Alexa, 35mm lens, cinematic, 24fps.

**Copy:** "Assemble the box. Plain cardboard. No reused packaging — fresh structure only."
**Scroll range:** 58–66%

### Beat 07 — Include your submission form
**Technique:** Video (Higgsfield)
**Shot:** Hand places the printed form inside the open box, next to the wrapped card. Camera pushes in.
**Higgsfield prompt:**
> Close-up shot looking into an open cardboard shipping box. A hand places a folded white paper form inside, next to a wrapped trading card protected in bubble wrap. Soft natural light, shallow depth of field, clean white background. Camera slowly pushes in. Shot on Arri Alexa, 50mm lens, cinematic.

**Copy:** "Include your submission form. Inside the box, on top. Multiple submissions? Bundle each separately."
**Scroll range:** 66–74%

### Beat 08 — Seal the box (HERO)
**Technique:** Video (Higgsfield)
**Shot:** Macro close-up of packing tape being pulled across the top seam of the box. The signature *zzzip* texture. Hands smooth it down.
**Higgsfield prompt:**
> Extreme macro close-up of packing tape being pulled across the seam of a white cardboard shipping box. The tape is transparent and glossy. A hand pulls a dispenser smoothly across the top. Hands then press the tape down firmly. Soft natural lighting, shallow depth of field, cinematic 24fps, clean white background. Shot on Arri Alexa, 100mm macro lens.

**Copy:** "Seal the box. Packing tape only. No painter's tape, no scotch, no reused tape."
**Scroll range:** 74–82%

### Beat 09 — Apply your tracking label (HERO — the scissors moment)
**Technique:** Video (Higgsfield) — two shots edited together
**Shot A — The cut:** Macro close-up of scissors entering frame already in motion, cutting along the dashed line of a printed tracking label. Clean cut. Label falls onto the surface.
**Shot B — The application:** Hand picks up the label, places it on the box top, smooths it down. Macro on the barcode.

**Higgsfield prompt A:**
> Extreme macro close-up of metal scissors mid-cut, slicing along a dashed line on a printed white paper tracking label with a black barcode. Clean precise cut. The label section separates and falls onto a white surface. Soft natural lighting, shallow depth of field, satisfying ASMR feel. Shot on Arri Alexa, 100mm macro lens, cinematic, 24fps.

**Higgsfield prompt B:**
> Close-up shot of a hand placing a white tracking label with a black barcode onto the top of a white cardboard shipping box. The hand smooths the label down with the thumb. Soft natural lighting, shallow depth of field, clean white background. Camera holds steady, macro detail. Shot on Arri Alexa, 50mm lens, cinematic.

**Production note:** Highest-risk shot in the project. Scissors mid-cut is exactly the shot AI video models flub. If A fails after ~15 attempts, fall back to a stop-motion-feel reveal where the cut happens off-screen and we just see the result on the surface.

**Copy:** "Apply your tracking label. Directly on the box. Clear tape over it, barcode fully visible. Skip this and you skip the queue."
**Scroll range:** 82–90%

### Beat 10 — Hand it off (HERO — the closer)
**Technique:** Video (Higgsfield)
**Shot:** Sealed, labeled box in two hands. Camera close. Hands extend the box across the frame. A second pair of hands (FedEx uniform sleeve, navy stripe visible) reaches in and takes it. Quick rack focus to the box being placed on a counter. Camera pulls back. Holds.

**Higgsfield prompt:**
> Cinematic close-up shot of two hands holding a sealed white cardboard shipping box with a barcode label visible. The hands extend the box forward. A second pair of hands wearing a navy blue uniform sleeve reaches in from frame-right and takes the box. The camera rack-focuses to the uniformed person placing the box on a counter. Soft warm lighting, shallow depth of field, cinematic 24fps, slight handheld movement. Shot on Arri Alexa, 35mm lens.

**Copy:** "Hand it off. PSA addresses below, by item type and carrier. Your card is in the system."
**Scroll range:** 90–96%

### Beat 11 — The Loop (closer + return)
**Technique:** Video → 3D match cut
**Shot:** Box on the counter behind the courier. Quick fade to white. Inside the white, a PSA-graded slab materializes briefly — the Mega Charizard X now encased in clear plastic with the PSA label across the top. Holds for one beat. The slab dissolves back into the bare card hovering in the void (matches the opening shot of Beat 00).
**Implementation:** As scroll passes 100%, the experience visually loops back to Beat 00. User can scroll up to revisit, or just watch the cycle complete.
**Copy:** Optional. Could be one line: "Graded. Returned. Forever protected." Or pure cinematic — no text.
**Scroll range:** 96–100%

---

## Higgsfield production notes

### Soul Character to train
A single set of hands. Same skin tone, same wrist visibility, no rings or watches. This is the unifying thread across all video clips. Train once, reuse across all 6 shots.

**Training reference strategy:** Either use stock photo set or generate via Nano Banana Pro first, then train Soul on those generated images. Latter gives more consistency since the source set is already coherent.

### Consistency anchors across all clips
- Lighting: soft, natural, slightly warm
- Surface: clean white tabletop
- Camera: shallow DOF, 35-100mm range
- Color grade: low contrast, slight desaturation, film-like
- Frame rate: 24fps
- Format: 16:9 for desktop site (vertical reformats for mobile fallback if pursued)

### Production order
1. Train Soul Character (hands) — must complete before any shot
2. Generate Beats 05–07 first (simpler — single object actions)
3. Generate Beat 08 (tape) — tests Seedance with transparent material
4. Generate Beat 09 (scissors) — hardest beat, save for when you're warmed up
5. Generate Beat 10 (handoff) — requires two characters, save for last
6. Generate Beat 11 (slab) — likely a still + subtle motion, can be done last

### Credit budget
~15-20 generations per shot to land the right take. Budget for 100-120 total generations.

---

## 3D asset list

All assets coded directly in R3F. Tripo / Meshy held in reserve for any hero detail object that comes up later.

| Asset | Geometry | Material | Notes |
|---|---|---|---|
| Charizard card | `RoundedBox` (low poly) | Custom `shaderMaterial` (holo) | Front: SIR JPEG. Back: standard Pokémon back. |
| Penny sleeve | Box with one open edge | Transparent PBR | Slight texture/grain on plastic |
| Semi-rigid | Thicker box, transparent | Stiffer transparent PBR | Visible thickness |
| Team bag | Plane + flap (separate mesh) | Transparent PBR with flap | Animated unfold |
| Cardboard ×2 | Plane with thickness | Cardboard texture | Slightly oversized vs card |
| Studio environment | HDRI + 1 spotlight | N/A | Dark, dramatic |
| PSA slab (closer only) | RoundedBox with frame | Clear PBR + plastic | Only appears in Beat 11 |

---

## Scroll choreography summary

| Scroll % | Beat | Mode |
|---|---|---|
| 0–5 | 00 — title / cold open | 3D |
| 5–15 | 01 — sleeve | 3D |
| 15–25 | 02 — semi-rigid | 3D |
| 25–35 | 03 — team bag | 3D |
| 35–45 | 04 — cardboard | 3D |
| 45–50 | T — pull-back transition | 3D → Video |
| 50–58 | 05 — form print | Video |
| 58–66 | 06 — box assembly | Video |
| 66–74 | 07 — form into box | Video |
| 74–82 | 08 — seal | Video |
| 82–90 | 09 — label cut + apply | Video |
| 90–96 | 10 — handoff | Video |
| 96–100 | 11 — loop / slab → bare card | Video → 3D |

---

## Copy bible (final)

| Beat | Copy |
|---|---|
| 00 | "How to ship a card to PSA." / "An immersive walkthrough." |
| 01 | "Sleeve your card. Penny sleeve, opening facing up. Slide slowly — the holo deserves it." |
| 02 | "Into the semi-rigid. Card-Saver I or equivalent. Snug, never forced." |
| 03 | "Team bag it. Optional, but recommended. Moisture is the enemy." |
| 04 | "Cardboard sandwich. Two pieces, slightly larger than the card. Protection from every angle." |
| 05 | "Print your submission form. The paperwork makes it real." |
| 06 | "Assemble the box. Plain cardboard. No reused packaging — fresh structure only." |
| 07 | "Include your submission form. Inside the box, on top. Multiple submissions? Bundle each separately." |
| 08 | "Seal the box. Packing tape only. No painter's tape, no scotch, no reused tape." |
| 09 | "Apply your tracking label. Directly on the box. Clear tape over it, barcode fully visible. Skip this and you skip the queue." |
| 10 | "Hand it off. PSA addresses below, by item type and carrier. Your card is in the system." |
| 11 | "Graded. Returned. Forever protected." (optional) |

**Style note:** No em dashes anywhere. Hyphens or sentence breaks only.
