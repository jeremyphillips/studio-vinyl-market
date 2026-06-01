import { breakpoints, type Breakpoint } from './breakpoints'

/**
 * Builds a next/image `sizes` attribute string from a named breakpoint.
 *
 * @example
 * buildImageSizes('md', 480) // → "(min-width: 768px) 480px, 100vw"
 * buildImageSizes('xl', 1280) // → "(min-width: 1280px) 1280px, 100vw"
 */
export function buildImageSizes(bp: Breakpoint, pxSize: number): string {
  return `(min-width: ${breakpoints[bp]}px) ${pxSize}px, 100vw`
}
