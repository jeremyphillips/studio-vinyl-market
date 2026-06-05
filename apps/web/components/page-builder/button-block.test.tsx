import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

import { ButtonBlock } from './button-block'

const internalArtist = { _type: 'artist' as const, slug: 'boards-of-canada' }
const internalReleases = { _type: 'releasesPage' as const, slug: null }

describe('ButtonBlock', () => {
  describe('unresolvable link', () => {
    it('renders a disabled button when no external URL is set', () => {
      render(
        <ButtonBlock
          label="Click me"
          variant="default"
          size="default"
          linkType="external"
          externalUrl={null}
          internalLink={null}
        />,
      )
      expect(screen.getByRole('button', { name: 'Click me' })).toBeDisabled()
    })

    it('renders a disabled button when internal link is null', () => {
      render(
        <ButtonBlock
          label="Browse"
          variant="default"
          size="default"
          linkType="internal"
          externalUrl={null}
          internalLink={null}
        />,
      )
      expect(screen.getByRole('button', { name: 'Browse' })).toBeDisabled()
    })
  })

  describe('external link', () => {
    it('renders an <a> with target="_blank" and rel="noreferrer"', () => {
      render(
        <ButtonBlock
          label="Visit"
          variant="default"
          size="default"
          linkType="external"
          externalUrl="https://bandcamp.com"
          internalLink={null}
        />,
      )
      const link = screen.getByRole('link', { name: 'Visit' })
      expect(link).toHaveAttribute('href', 'https://bandcamp.com')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noreferrer')
    })
  })

  describe('internal link', () => {
    it('renders a Next.js Link for a slug-based type', () => {
      render(
        <ButtonBlock
          label="Artist"
          variant="default"
          size="default"
          linkType="internal"
          externalUrl={null}
          internalLink={internalArtist}
        />,
      )
      const link = screen.getByRole('link', { name: 'Artist' })
      expect(link).toHaveAttribute('href', '/artists/boards-of-canada')
    })

    it('renders a Next.js Link for releasesPage', () => {
      render(
        <ButtonBlock
          label="Releases"
          variant="default"
          size="default"
          linkType="internal"
          externalUrl={null}
          internalLink={internalReleases}
        />,
      )
      const link = screen.getByRole('link', { name: 'Releases' })
      expect(link).toHaveAttribute('href', '/releases')
    })
  })

  describe('label fallback', () => {
    it('renders "Button" when label is an empty string', () => {
      render(
        <ButtonBlock
          label=""
          variant="default"
          size="default"
          linkType="external"
          externalUrl={null}
          internalLink={null}
        />,
      )
      expect(screen.getByRole('button', { name: 'Button' })).toBeDisabled()
    })
  })

  describe('accessibility', () => {
    it('disabled button has no violations', async () => {
      const { container } = render(
        <ButtonBlock
          label="Buy"
          variant="default"
          size="default"
          linkType="external"
          externalUrl={null}
          internalLink={null}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('external link has no violations', async () => {
      const { container } = render(
        <ButtonBlock
          label="Buy"
          variant="default"
          size="default"
          linkType="external"
          externalUrl="https://bandcamp.com"
          internalLink={null}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('internal link has no violations', async () => {
      const { container } = render(
        <ButtonBlock
          label="Artist"
          variant="default"
          size="default"
          linkType="internal"
          externalUrl={null}
          internalLink={internalArtist}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
