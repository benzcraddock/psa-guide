'use client'

import { shaderMaterial } from '@react-three/drei'
import type { ThreeElement } from '@react-three/fiber'
import * as THREE from 'three'

const HoloMaterialImpl = shaderMaterial(
  {
    uTexture: null as THREE.Texture | null,
    uNoiseTexture: null as THREE.Texture | null,
    uLightDir: new THREE.Vector3(-0.3, 0.7, 0.6),
    uSweepOffset: new THREE.Vector2(0, 0),
    uShimmerIntensity: 1.0,
    uGrainDensity: 1.0,
    uMatteFalloff: 1.05,
    uWarmTint: 0.6,
    uTime: 0,
  },
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
  /* glsl */ `
    uniform sampler2D uTexture;
    uniform sampler2D uNoiseTexture;
    uniform vec3 uLightDir;
    uniform vec2 uSweepOffset;
    uniform float uShimmerIntensity;
    uniform float uGrainDensity;
    uniform float uMatteFalloff;
    uniform float uWarmTint;
    uniform float uTime;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec2 cardSize = vec2(2.5, 3.5);
      float cornerRadius = 0.12;
      vec2 pos = (vUv - 0.5) * cardSize;
      vec2 d = abs(pos) - (cardSize * 0.5 - cornerRadius);
      if (length(max(d, 0.0)) - cornerRadius > 0.0) discard;

      vec3 normal = normalize(vNormal);
      vec3 lightDir = normalize(uLightDir);
      vec3 viewDir = normalize(vViewPosition);

      vec3 baseColor = pow(texture2D(uTexture, vUv).rgb, vec3(0.92));
      float lum = dot(baseColor, vec3(0.299, 0.587, 0.114));
      baseColor = mix(vec3(lum), baseColor, 1.12);

      float luminance = dot(baseColor, vec3(0.299, 0.587, 0.114));
      float verticalGradient = smoothstep(0.0, 0.55, vUv.y);
      float foilMask = clamp((luminance + 0.18) * verticalGradient * 1.7, 0.0, 1.0);

      vec2 lightUv = vec2(0.5) + lightDir.xy * 0.4 + uSweepOffset;
      float litZoneDist = distance(vUv, lightUv);
      float litZone = pow(1.0 - smoothstep(0.0, 0.9, litZoneDist), uMatteFalloff);

      vec2 noiseUv = vUv * 8.0 + normal.xy * 0.05;
      float grain = texture2D(uNoiseTexture, noiseUv).r;
      grain = smoothstep(0.4, 1.0, grain);

      vec3 sheenColor = mix(
        vec3(0.78, 0.86, 0.96),
        vec3(0.92, 0.86, 0.76),
        uWarmTint
      );

      vec2 bandDir = normalize(vec2(-lightDir.y, lightDir.x));
      float bandT = dot(vUv - vec2(0.5), bandDir) + 0.5;
      vec3 hueBand = mix(
        vec3(0.7, 0.85, 1.0),
        vec3(1.0, 0.9, 0.78),
        smoothstep(0.3, 0.7, bandT)
      );

      vec3 finalColor = baseColor;
      finalColor += sheenColor * litZone * foilMask * 0.29 * uShimmerIntensity;
      finalColor += (hueBand - vec3(0.5)) * litZone * foilMask * 0.15 * uShimmerIntensity;
      finalColor += sheenColor * grain * litZone * foilMask * 0.38 * uShimmerIntensity * uGrainDensity;

      float fresnel = 1.0 - max(0.0, dot(normal, viewDir));
      fresnel = pow(fresnel, 2.5);
      finalColor += vec3(0.95, 0.86, 0.74) * fresnel * 0.33 * uShimmerIntensity;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
)

declare module '@react-three/fiber' {
  interface ThreeElements {
    holoMaterial: ThreeElement<typeof HoloMaterialImpl>
  }
}

export { HoloMaterialImpl as HoloMaterial }
