export interface Guy {
  id: string
  x: number
  y: number
  w: number
  h: number
  theGuy: boolean
}

export type Directions =
  | 0 // Up
  | 1 // Right
  | 2 // Down
  | 3 // Left

export type IdLocation = { id: string; location: string }
