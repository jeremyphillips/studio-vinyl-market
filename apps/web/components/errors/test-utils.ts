import {screen} from '@testing-library/react'
import {expect} from 'vitest'

export function expectCatalogueEscapeLinks() {
  expect(screen.getByRole('link', {name: 'Back to home'})).toHaveAttribute('href', '/')
  expect(screen.getByRole('link', {name: 'Browse releases'})).toHaveAttribute(
    'href',
    '/releases',
  )
}
