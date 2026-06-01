/**
 * Breakpoint map — JS mirror of styles/tokens/breakpoints.css.
 * Values are in pixels (CSS rem value × 16).
 *
 * Keep both files in sync. Run `yarn test` to validate.
 * Image utility helper: lib/image.ts
 */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type Breakpoint = keyof typeof breakpoints
