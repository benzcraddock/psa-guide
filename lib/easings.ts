export const linear = (t: number) => t

export const easeInOut = (t: number) => t * t * (3 - 2 * t)

export const easeIn = (t: number) => t * t

export const easeOut = (t: number) => 1 - (1 - t) * (1 - t)
