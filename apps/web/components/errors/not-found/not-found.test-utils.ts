import { screen } from '@testing-library/react'
import { expect } from 'vitest'

export function expectCatalogueEscapeLinks(
  browseLabel = 'Browse releases',
  browseHref = '/releases',
) {
  expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/')
  expect(screen.getByRole('link', { name: browseLabel })).toHaveAttribute('href', browseHref)
}
