import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { breakpoints } from './breakpoints'

const CSS_FILE = resolve(fileURLToPath(import.meta.url), '../../styles/tokens/breakpoints.css')

/**
 * Parses --breakpoint-* declarations from the CSS @theme block.
 * Returns a map of { sm: 640, md: 768, ... } (rem × 16 → px).
 */
function parseCssBreakpoints(): Record<string, number> {
  const css = readFileSync(CSS_FILE, 'utf-8')
  const result: Record<string, number> = {}

  for (const match of css.matchAll(/--breakpoint-([\w-]+):\s*([\d.]+)rem/g)) {
    const [, name, remStr] = match
    if (!name || !remStr) continue
    result[name] = parseFloat(remStr) * 16
  }

  return result
}

describe('breakpoints CSS ↔ TS sync', () => {
  it('has the same keys as the CSS token file', () => {
    const cssKeys = Object.keys(parseCssBreakpoints()).sort()
    const tsKeys = Object.keys(breakpoints).sort()
    expect(tsKeys).toEqual(cssKeys)
  })

  it('has pixel values that match the CSS rem values (rem × 16)', () => {
    const cssBreakpoints = parseCssBreakpoints()
    for (const [name, pxValue] of Object.entries(breakpoints)) {
      expect(
        cssBreakpoints[name],
        `breakpoints.${name}: expected ${pxValue}px but CSS defines ${cssBreakpoints[name]}px`,
      ).toBe(pxValue)
    }
  })
})
