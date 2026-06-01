import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'

import { CoverImage } from './cover-image'

vi.mock('@/sanity/image', () => ({
  urlFor: () => ({
    width: () => ({
      height: () => ({
        url: () => 'https://cdn.example.com/cover.jpg',
      }),
    }),
  }),
}))

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
  }: {
    src: string
    alt: string
    width: number
    height: number
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} />
  ),
}))

const assetSource = {
  asset: { _ref: 'image-abc123-800x800-jpg', _type: 'reference' as const },
  alt: 'Radiohead — OK Computer',
  _type: 'image' as const,
}

const noAssetSource = {
  asset: null,
  _type: 'image' as const,
}

describe('CoverImage', () => {
  describe('fallback (no asset ref)', () => {
    it('renders a fallback with role="img" and descriptive label', () => {
      render(<CoverImage source={noAssetSource as never} />)

      const fallback = screen.getByRole('img', { name: 'No cover image' })
      expect(fallback).toBeInTheDocument()
      expect(fallback).toHaveTextContent('No cover')
    })

    it('has no accessibility violations', async () => {
      const { container } = render(<CoverImage source={noAssetSource as never} />)

      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('image (asset ref present)', () => {
    it('renders an img with the resolved URL', () => {
      render(<CoverImage source={assetSource} />)

      expect(screen.getByRole('img')).toHaveAttribute('src', 'https://cdn.example.com/cover.jpg')
    })

    it('uses the explicit alt prop when provided', () => {
      render(<CoverImage source={assetSource} alt="Custom alt text" />)

      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Custom alt text')
    })

    it('falls back to source.alt when no explicit alt is given', () => {
      render(<CoverImage source={assetSource} />)

      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Radiohead — OK Computer')
    })

    it('uses an empty alt string when neither explicit alt nor source.alt is set', () => {
      const sourceWithoutAlt = { ...assetSource, alt: undefined }
      const { container } = render(<CoverImage source={sourceWithoutAlt} />)

      // alt="" marks the image as decorative; it is role="presentation" in the a11y tree,
      // so we query the DOM element directly rather than via getByRole('img').
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('alt', '')
    })

    it('has no accessibility violations', async () => {
      const { container } = render(<CoverImage source={assetSource} />)

      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
