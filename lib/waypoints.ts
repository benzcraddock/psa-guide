import { easeInOut, easeOut, linear } from './easings'

export interface CameraWaypoint {
  scrollAt: number
  position: [number, number, number]
  lookAt: [number, number, number]
  fov: number
  easing?: (t: number) => number
}

export const waypoints: CameraWaypoint[] = [
  {
    scrollAt: 0,
    position: [0, 0, 8.5],
    lookAt: [0, 0, 0],
    fov: 35,
    easing: easeInOut,
  },
  {
    scrollAt: 0.05,
    position: [0, 0, 9.0],
    lookAt: [0, 0, 0],
    fov: 35,
    easing: easeInOut,
  },
  {
    scrollAt: 0.09,
    position: [0, 0, 9.0],
    lookAt: [0, 0, 0],
    fov: 35,
    easing: easeOut,
  },
  {
    scrollAt: 0.15,
    position: [0, -0.4, 5.5],
    lookAt: [0, -0.5, 0],
    fov: 35,
    easing: easeInOut,
  },
  {
    scrollAt: 0.20,
    position: [0, -0.3, 9.0],
    lookAt: [0, -0.6, 0],
    fov: 35,
    easing: easeInOut,
  },
  {
    scrollAt: 0.30,
    position: [0, -0.2, 9.0],
    lookAt: [0, -0.7, 0],
    fov: 35,
    easing: easeInOut,
  },
  {
    scrollAt: 0.40,
    position: [0, -0.1, 9.0],
    lookAt: [0, -0.8, 0],
    fov: 35,
    easing: easeInOut,
  },
  {
    scrollAt: 0.45,
    position: [0, -0.05, 9.0],
    lookAt: [0, -0.8, 0],
    fov: 35,
    easing: easeInOut,
  },
  {
    scrollAt: 0.50,
    position: [0, 0, 9.0],
    lookAt: [0, -0.8, 0],
    fov: 35,
    easing: linear,
  },
]
