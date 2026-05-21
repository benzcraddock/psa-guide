# Holo Shader Spec

**Target behavior:** Match the visual feel of a real Pokémon TCG Special Illustration Rare (SIR) under directional light. Reference: photo of the actual Mega Charizard X EX SIR under lamp light (added to `/reference/` folder).

**Status:** Phase 1 prototype validated in canvas2d (see chat history with Claude on Nov 2026). Approved for R3F port.

---

## Visual model

A SIR is **matte but glossy.** It does not behave like a vintage cosmos holo (which shimmers uniformly). It behaves like brushed metal or pearlescent paint with embossed micro-texture:

- **When light hits it directly:** scattered scintillation, soft silver-cyan sheen with subtle warm hue shift, fine-grain dust texture catching light at thousands of micro-points
- **When light doesn't hit it:** mostly matte, slight color depth, no shimmer
- **At grazing angles:** soft cyan fresnel rim on the edges
- **Regional variance:** top half (the illustration / dragon) catches more light than the bottom half (the attack text box)

## Decomposition into shader layers

The effect is the composite of five separate layers, all driven by the angle between the surface normal and the light direction:

### Layer 1 — Base color
The raw card texture (the SIR JPEG). No modification. This is what you see when no light is hitting the foil.

### Layer 2 — Foil mask
A grayscale texture defining where the foil is reflective. Hand-painted in Phase 2. For Phase 1, derived procedurally from luminance + a vertical gradient (top brighter than bottom). White = full foil, black = no foil.

### Layer 3 — Lit zone
A soft elliptical bright region that *tracks the light angle.* As the card tilts, the zone slides across the surface. Outside this zone, all subsequent effects fall to zero (this is what makes the matte vs lit distinction work).

Mathematically: distance from a moving point that is a function of `(surface_normal · light_direction)`.

### Layer 4 — Scintillation grain
A static high-frequency noise texture, sampled within the lit zone. This is what creates the "dusty," scattered, frosted look. Tinted silver-cyan-warm. Slight UV offset based on tilt to feel like the grain shifts with angle.

### Layer 5 — Soft sheen
A broader radial gradient inside the lit zone, silver-cyan tint with warm tint slider. This is the "matte glow" — the larger color wash on top of the scintillation.

### Layer 6 — Hue shift band
A narrow gradient (NOT a rainbow — silver → light cyan → warm white) perpendicular to the light direction. Subtle. This is the only color-shifting element. Must be MUCH more constrained than a typical "iridescent" shader.

### Layer 7 — Fresnel rim
Edge glow that intensifies as the card tilts away from camera. Soft cyan. Only visible on edges facing away from the dominant light.

### Composition
- Base color (source-over)
- Sheen (screen, masked by foil × lit zone)
- Hue band (overlay, masked by foil × lit zone)
- Scintillation (screen, masked by foil × lit zone × intensity)
- Fresnel rim (screen, additive on edges)

---

## Tunable parameters

These are the four user-facing controls in the prototype. Carry over to R3F as uniforms.

| Param | Range | Default | Purpose |
|---|---|---|---|
| `uShimmerIntensity` | 0 – 2 | 1.0 | Overall brightness multiplier for layers 4, 5, 6, 7 |
| `uGrainDensity` | 0 – 2 | 1.0 | Multiplier on scintillation alpha |
| `uMatteFalloff` | 0.5 – 3 | 1.5 | Exponent on lit zone alpha — higher = more matte (sharper falloff outside zone) |
| `uWarmTint` | 0 – 1 | 0.3 | Pushes sheen color from cool cyan toward warmer silver |

Additional internal uniforms (not user-facing):

| Param | Purpose |
|---|---|
| `uLightDir` | Light direction vector (driven by scene lighting) |
| `uTime` | For any subtle animation (probably none in v1) |
| `uTexture` | The base card texture |
| `uFoilMask` | The foil mask texture |
| `uNoiseTexture` | Pre-baked scintillation noise |

---

## R3F implementation skeleton

```jsx
// HoloMaterial.tsx
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

const HoloMaterial = shaderMaterial(
  {
    uTexture: null,
    uFoilMask: null,
    uNoiseTexture: null,
    uLightDir: new THREE.Vector3(-0.3, 0.7, 0.6),
    uShimmerIntensity: 1.0,
    uGrainDensity: 1.0,
    uMatteFalloff: 1.5,
    uWarmTint: 0.3,
    uTime: 0,
  },
  // vertex shader
  /* glsl */ `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // fragment shader
  /* glsl */ `
    uniform sampler2D uTexture;
    uniform sampler2D uFoilMask;
    uniform sampler2D uNoiseTexture;
    uniform vec3 uLightDir;
    uniform float uShimmerIntensity;
    uniform float uGrainDensity;
    uniform float uMatteFalloff;
    uniform float uWarmTint;
    uniform float uTime;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 lightDir = normalize(uLightDir);
      vec3 viewDir = normalize(vViewPosition);
      
      // Base color (Layer 1)
      vec3 baseColor = texture2D(uTexture, vUv).rgb;
      
      // Foil mask (Layer 2)
      float foilMask = texture2D(uFoilMask, vUv).r;
      
      // Lit zone (Layer 3)
      // The "lit zone" position in UV space tracks the light angle
      vec2 lightUv = vec2(0.5) + lightDir.xy * 0.4;
      float litZoneDist = distance(vUv, lightUv);
      float litZone = pow(1.0 - smoothstep(0.0, 0.5, litZoneDist), uMatteFalloff);
      
      // Scintillation grain (Layer 4)
      // Sample noise with slight UV offset based on tilt
      vec2 noiseUv = vUv * 8.0 + normal.xy * 0.05;
      float grain = texture2D(uNoiseTexture, noiseUv).r;
      grain = smoothstep(0.4, 1.0, grain); // sharpen the highlights
      
      // Sheen color (Layer 5)
      vec3 sheenColor = mix(
        vec3(0.78, 0.86, 0.96),  // cool cyan
        vec3(0.92, 0.86, 0.76),  // warm silver
        uWarmTint
      );
      
      // Hue shift band (Layer 6)
      // Direction perpendicular to light tilt drives a subtle color sweep
      vec2 bandDir = normalize(vec2(-lightDir.y, lightDir.x));
      float bandT = dot(vUv - vec2(0.5), bandDir) + 0.5;
      vec3 hueBand = mix(
        vec3(0.7, 0.85, 1.0),
        vec3(1.0, 0.9, 0.78),
        smoothstep(0.3, 0.7, bandT)
      );
      
      // Composition
      vec3 finalColor = baseColor;
      
      // Apply sheen (Layer 5)
      finalColor += sheenColor * litZone * foilMask * 0.3 * uShimmerIntensity;
      
      // Apply hue band (Layer 6)
      finalColor += (hueBand - vec3(0.5)) * litZone * foilMask * 0.15 * uShimmerIntensity;
      
      // Apply scintillation (Layer 4)
      finalColor += sheenColor * grain * litZone * foilMask * 0.4 * uShimmerIntensity * uGrainDensity;
      
      // Apply fresnel rim (Layer 7)
      float fresnel = 1.0 - max(0.0, dot(normal, viewDir));
      fresnel = pow(fresnel, 2.5);
      finalColor += vec3(0.7, 0.85, 0.95) * fresnel * 0.4 * uShimmerIntensity;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
)

extend({ HoloMaterial })

// Then use in your card mesh:
// <mesh>
//   <boxGeometry args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]} />
//   <holoMaterial uTexture={cardTexture} uFoilMask={maskTexture} uNoiseTexture={noiseTexture} />
// </mesh>
```

**Notes for implementer:**

- This is a starting point, not a final shader. Expect 1-2 days of tuning to match the photo reference.
- The `uLightDir` should be driven by the scene's actual light position, not hardcoded. Pass it from React via `useFrame`.
- The noise texture should be pre-baked, NOT generated procedurally in the shader (too expensive). Generate a 512×512 multi-octave noise PNG offline and load it.
- The foil mask for Phase 1 can be auto-generated from the JPEG using a luminance + vertical gradient (Python script or just hand-paint in Photoshop and ship as a static asset).

---

## Phase 1 vs Phase 2

### Phase 1 (ship with this)
- Procedurally generated foil mask (luminance-based)
- No hand-painted normal map (use a flat normal)
- Single noise texture
- Tunable via the 4 user params above

### Phase 2 (polish pass, post-launch)
- Hand-painted foil mask in Photoshop (artist defines which areas catch what light)
- Hand-painted normal map for the embossed texture pattern (follows the artwork contours — dragon outline, flame swirls)
- Multiple noise octaves blended
- Possible: add a parallax effect on the dragon's eye to make it feel even more alive

---

## Acceptance criteria (Phase 1)

The shader is "done enough to ship" when:

1. With sliders at default values, the card has visible shimmer that moves as the camera orbits
2. The shimmer is silver-cyan, not rainbow
3. Bottom half (attack text region) catches less light than top half
4. Card edges show a soft cyan rim when tilted heavily
5. With `uMatteFalloff` cranked to 2.5, the shimmer is clearly localized to a "spotlight" zone
6. Side-by-side comparison with the reference photo, the *behavior* matches even if the artistic detail differs

If criterion #6 fails, do not move past shader work. The whole site's emotional payoff depends on this beat.
