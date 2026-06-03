import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'

import { ReleaseMeta } from './release-meta'

const fullDataProps = {
  mediaType: 'vinyl',
  classification: 'LP',
  size: '12"',
  speed: '33',
  channels: 'stereo',
  descriptions: ['reissue'],
  releaseYear: 1969,
  dateUnknown: false,
  label: { name: 'Blue Note', slug: 'blue-note' },
  noLabel: false,
}

describe('ReleaseMeta', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<ReleaseMeta {...fullDataProps} />)

    expect(await axe(container)).toHaveNoViolations()
  })

  describe('format row', () => {
    it('renders a joined format string from mediaType, classification, size, speed, channels', () => {
      render(<ReleaseMeta {...fullDataProps} />)

      expect(screen.getByText('Vinyl, LP, 12", 33⅓ RPM, Stereo')).toBeInTheDocument()
    })

    it('omits optional format parts that are not provided', () => {
      render(<ReleaseMeta mediaType="cd" classification="EP" label={null} />)

      expect(screen.getByText('CD, EP')).toBeInTheDocument()
    })
  })

  describe('descriptions row', () => {
    it('renders the descriptions row when descriptions are present', () => {
      render(<ReleaseMeta {...fullDataProps} />)

      expect(screen.getByText('Descriptions')).toBeInTheDocument()
      expect(screen.getByText('Reissue')).toBeInTheDocument()
    })

    it('does not render the descriptions row when descriptions is null', () => {
      render(<ReleaseMeta {...fullDataProps} descriptions={null} />)

      expect(screen.queryByText('Descriptions')).not.toBeInTheDocument()
    })

    it('does not render the descriptions row when descriptions is empty', () => {
      render(<ReleaseMeta {...fullDataProps} descriptions={[]} />)

      expect(screen.queryByText('Descriptions')).not.toBeInTheDocument()
    })
  })

  describe('year row', () => {
    it('renders the release year when provided', () => {
      render(<ReleaseMeta {...fullDataProps} />)

      expect(screen.getByText('Year')).toBeInTheDocument()
      expect(screen.getByText('1969')).toBeInTheDocument()
    })

    it('renders "Year unknown" when dateUnknown is true', () => {
      render(<ReleaseMeta {...fullDataProps} releaseYear={null} dateUnknown={true} />)

      expect(screen.getByText('Year unknown')).toBeInTheDocument()
    })

    it('does not render the year row when neither releaseYear nor dateUnknown is set', () => {
      render(<ReleaseMeta {...fullDataProps} releaseYear={null} dateUnknown={false} />)

      expect(screen.queryByText('Year')).not.toBeInTheDocument()
    })
  })

  describe('label row', () => {
    it('renders a link to the label when label is provided', () => {
      render(<ReleaseMeta {...fullDataProps} />)

      const link = screen.getByRole('link', { name: 'Blue Note' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/labels/blue-note')
    })

    it('renders "No label" when noLabel is true', () => {
      render(<ReleaseMeta {...fullDataProps} label={null} noLabel={true} />)

      expect(screen.getByText('No label')).toBeInTheDocument()
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })

    it('renders an em-dash when label is absent and noLabel is false', () => {
      render(<ReleaseMeta {...fullDataProps} label={null} noLabel={false} />)

      expect(screen.getByText('—')).toBeInTheDocument()
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })
  })
})
