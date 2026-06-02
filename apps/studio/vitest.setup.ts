import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// jsdom does not implement matchMedia, which @sanity/ui relies on when rendering.
// Defined as a plain function (not vi.fn) so vi.restoreAllMocks() in tests cannot wipe it.
if (typeof window !== 'undefined' && !window.matchMedia) {
  const noop = () => {}
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: noop,
      removeListener: noop,
      addEventListener: noop,
      removeEventListener: noop,
      dispatchEvent: () => false,
    }) as MediaQueryList
}

afterEach(() => {
  cleanup()
})
