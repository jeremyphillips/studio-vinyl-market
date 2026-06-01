import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'

import {NotFoundContent} from './not-found-content'
import {expectCatalogueEscapeLinks} from './not-found.test-utils'

describe('NotFoundContent', () => {
  it('renders default copy and a single main heading', () => {
    render(<NotFoundContent />)

    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('Page not found')
    expect(
      screen.getByText('That record, artist, or page isn’t in the catalogue.'),
    ).toBeInTheDocument()
  })

  it('renders custom title and description', () => {
    render(
      <NotFoundContent
        title="Release not found"
        description="This pressing is not listed."
      />,
    )

    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('Release not found')
    expect(screen.getByText('This pressing is not listed.')).toBeInTheDocument()
  })

  it('renders default catalogue escape links', () => {
    render(<NotFoundContent />)

    expectCatalogueEscapeLinks()
  })

  it('renders custom browse link', () => {
    render(
      <NotFoundContent
        browseHref="/"
        browseLabel="Back to catalogue"
      />,
    )

    expectCatalogueEscapeLinks('Back to catalogue', '/')
  })
})
