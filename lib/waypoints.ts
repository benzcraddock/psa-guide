import { easeInOut, linear } from './easings'

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
    position: [0, 0, 5],
    lookAt: [0, 0, 0],
    fov: 35,
    easing: easeInOut,
  },
  {
    scrollAt: 0.05,
    position: [0, 0, 4.5],
    lookAt: [0, 0, 0],
    fov: 35,
    easing: easeInOut,
  },
  {
    scrollAt: 0.15,
    position: [0.4, -0.3, 1.4],
    lookAt: [0, 0, 0],
    fov: 35,
    easing: linear,
  },
]
