import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'

const mockUrlForResult = { url: () => 'https://cdn.example.com/cover.jpg' }
const mockHeightResult = { height: () => mockUrlForResult }
const mockWidthResult = { width: () => mockHeightResult }

vi.mock('@/sanity/image', () => ({
  urlFor: () => mockWidthResult,
}))

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

import { Identity } from './identity'

const cover = {
  asset: { _type: 'reference' as const, _ref: 'image-abc123-400x400-jpg' },
  alt: 'Cover',
}

describe('Identity', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <Identity
        eyebrow="Artist"
        name="Miles Davis"
        cover={cover}
        coverAlt="Miles Davis photo"
        releaseCount={12}
        locations={[{ city: 'Alton', state: 'Illinois', country: 'United States' }]}
      />,
    )

    expect(await axe(container)).toHaveNoViolations()
  })

  it('renders the eyebrow and name as the page heading', () => {
    render(<Identity eyebrow="Label" name="Blue Note" coverAlt="Blue Note logo" releaseCount={1} />)

    expect(screen.getByText('Label')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Blue Note' })).toBeInTheDocument()
  })

  it('pluralizes the release count', () => {
    const { rerender } = render(
      <Identity eyebrow="Artist" name="Solo" coverAlt="Solo photo" releaseCount={1} />,
    )
    expect(screen.getByText('1 release')).toBeInTheDocument()

    rerender(<Identity eyebrow="Artist" name="Solo" coverAlt="Solo photo" releaseCount={3} />)
    expect(screen.getByText('3 releases')).toBeInTheDocument()
  })

  it('renders the cover image with the provided alt text', () => {
    render(
      <Identity
        eyebrow="Artist"
        name="Miles Davis"
        cover={cover}
        coverAlt="Miles Davis photo"
        releaseCount={12}
      />,
    )

    expect(screen.getByRole('img', { name: 'Miles Davis photo' })).toBeInTheDocument()
  })

  it('renders locations when provided', () => {
    render(
      <Identity
        eyebrow="Artist"
        name="Miles Davis"
        coverAlt="Miles Davis photo"
        releaseCount={12}
        locations={[{ city: 'Alton', state: 'Illinois', country: 'United States' }]}
      />,
    )

    expect(screen.getByText('Alton, Illinois, United States')).toBeInTheDocument()
  })

  it('renders no location list when locations is null or empty', () => {
    const { rerender } = render(
      <Identity
        eyebrow="Artist"
        name="Miles Davis"
        coverAlt="Miles Davis photo"
        releaseCount={12}
        locations={null}
      />,
    )
    expect(screen.queryByRole('list')).not.toBeInTheDocument()

    rerender(
      <Identity
        eyebrow="Artist"
        name="Miles Davis"
        coverAlt="Miles Davis photo"
        releaseCount={12}
        locations={[]}
      />,
    )
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})
