import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'

import { DiscogsMeta } from './discogs-meta'

import { discogsMasterUrl, discogsReleaseUrl } from '@/lib/discogs'


describe('DiscogsMeta', () => {
  it('renders nothing without a releaseId', () => {
    const { container } = render(<DiscogsMeta releaseId={null} masterId={123} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders a release link when only releaseId is provided', () => {
    render(<DiscogsMeta releaseId={12345} />)

    expect(screen.getByRole('region', { name: 'Discogs' })).toBeInTheDocument()

    const releaseLink = screen.getByRole('link', { name: '12345' })
    expect(releaseLink).toHaveAttribute('href', discogsReleaseUrl(12345))
    expect(releaseLink).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.queryByRole('link', { name: '67890' })).not.toBeInTheDocument()
  })

  it('renders release and master links when both ids are provided', () => {
    render(<DiscogsMeta releaseId={12345} masterId={67890} />)

    expect(screen.getByRole('link', { name: '12345' })).toHaveAttribute(
      'href',
      discogsReleaseUrl(12345),
    )
    expect(screen.getByRole('link', { name: '67890' })).toHaveAttribute(
      'href',
      discogsMasterUrl(67890),
    )
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<DiscogsMeta releaseId={12345} masterId={67890} />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
