import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'

import { LocationList } from './location-list'

describe('LocationList', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <LocationList
        locations={[{ city: 'London', state: 'England', country: 'United Kingdom' }]}
      />,
    )

    expect(await axe(container)).toHaveNoViolations()
  })

  it('joins city, state and country into a single row', () => {
    render(
      <LocationList
        locations={[{ city: 'London', state: 'England', country: 'United Kingdom' }]}
      />,
    )

    expect(screen.getByText('London, England, United Kingdom')).toBeInTheDocument()
  })

  it('renders one list item per location', () => {
    render(
      <LocationList
        locations={[
          { city: 'London', state: 'England', country: 'United Kingdom' },
          { city: 'Berlin', state: null, country: 'Germany' },
        ]}
      />,
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('omits empty parts when joining', () => {
    render(<LocationList locations={[{ city: null, state: null, country: 'Japan' }]} />)

    expect(screen.getByText('Japan')).toBeInTheDocument()
  })

  it('renders nothing when no location has any value', () => {
    const { container } = render(
      <LocationList locations={[{ city: null, state: null, country: null }]} />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when the list is empty', () => {
    const { container } = render(<LocationList locations={[]} />)

    expect(container).toBeEmptyDOMElement()
  })
})
