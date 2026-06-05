import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'

const mockImageUrl = 'https://cdn.example.com/image.jpg'

vi.mock('@/sanity/image', () => ({
  urlFor: () => ({
    width: () => ({ url: () => mockImageUrl }),
  }),
}))

vi.mock('@/lib/image', () => ({
  buildImageSizes: () => '(max-width: 1280px) 100vw, 1280px',
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

import { ImageBlock } from './image-block'

const assetRef = 'image-abc123-1280x720-jpg'
const asset = { _ref: assetRef, _type: 'reference' as const }

describe('ImageBlock', () => {
  describe('no asset', () => {
    it('renders nothing when asset is null', () => {
      const { container } = render(
        <ImageBlock asset={null} hotspot={null} crop={null} alt="" caption={null} />,
      )
      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('with asset', () => {
    it('renders an img with the resolved URL', () => {
      render(
        <ImageBlock asset={asset} hotspot={null} crop={null} alt="A great photo" caption={null} />,
      )
      expect(screen.getByRole('img')).toHaveAttribute('src', mockImageUrl)
    })

    it('uses the provided alt text', () => {
      render(
        <ImageBlock asset={asset} hotspot={null} crop={null} alt="Alt text here" caption={null} />,
      )
      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Alt text here')
    })

    it('uses an empty string for alt when alt is an empty string', () => {
      const { container } = render(
        <ImageBlock asset={asset} hotspot={null} crop={null} alt="" caption={null} />,
      )
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('alt', '')
    })

    it('renders a figcaption when caption is set', () => {
      render(
        <ImageBlock asset={asset} hotspot={null} crop={null} alt="Photo" caption="A caption" />,
      )
      expect(screen.getByText('A caption')).toBeInTheDocument()
      expect(screen.getByText('A caption').tagName.toLowerCase()).toBe('figcaption')
    })

    it('omits figcaption when caption is null', () => {
      const { container } = render(
        <ImageBlock asset={asset} hotspot={null} crop={null} alt="Photo" caption={null} />,
      )
      expect(container.querySelector('figcaption')).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has no violations with a captioned image', async () => {
      const { container } = render(
        <ImageBlock
          asset={asset}
          hotspot={null}
          crop={null}
          alt="A great photo"
          caption="Caption text"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no violations with an uncaptioned image', async () => {
      const { container } = render(
        <ImageBlock asset={asset} hotspot={null} crop={null} alt="A great photo" caption={null} />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
