import {screen} from '@testing-library/react'
import {expect, vi} from 'vitest'

export function mockConsoleError() {
  return vi.spyOn(console, 'error').mockImplementation(() => {})
}

export function expectCatalogueEscapeLinks(
  browseLabel = 'Browse releases',
  browseHref = '/releases',
) {
  expect(screen.getByRole('link', {name: 'Back to home'})).toHaveAttribute('href', '/')
  expect(screen.getByRole('link', {name: browseLabel})).toHaveAttribute('href', browseHref)
}
