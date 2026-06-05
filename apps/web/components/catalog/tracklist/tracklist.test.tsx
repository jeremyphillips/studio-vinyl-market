import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'

import { Tracklist } from './tracklist'

type TestDisc = {
  _key: string
  discNumber: number
  name?: string | null
  tracks?: Array<{ _key: string; position: string; title: string }> | null
}

function makeDisc(overrides: Partial<TestDisc> = {}): TestDisc {
  return {
    _key: 'disc-1',
    discNumber: 1,
    tracks: [],
    ...overrides,
  }
}

describe('Tracklist', () => {
  describe('empty state (top-level)', () => {
    it('renders empty message when discs is null', () => {
      render(<Tracklist discs={null} />)
      expect(screen.getByText('No tracklist yet.')).toBeInTheDocument()
    })

    it('renders empty message when discs is an empty array', () => {
      render(<Tracklist discs={[]} />)
      expect(screen.getByText('No tracklist yet.')).toBeInTheDocument()
    })
  })

  describe('disc heading', () => {
    it('renders the disc name as a heading when provided', () => {
      render(<Tracklist discs={[makeDisc({ name: 'Bonus CD' })]} />)
      expect(screen.getByText('Bonus CD')).toBeInTheDocument()
    })

    it('falls back to "Disc N" when name is absent and there are multiple discs', () => {
      render(
        <Tracklist
          discs={[makeDisc({ _key: 'a', discNumber: 1 }), makeDisc({ _key: 'b', discNumber: 2 })]}
        />,
      )
      expect(screen.getByText('Disc 1')).toBeInTheDocument()
      expect(screen.getByText('Disc 2')).toBeInTheDocument()
    })

    it('omits the heading for a single unnamed disc', () => {
      render(<Tracklist discs={[makeDisc({ discNumber: 1 })]} />)
      expect(screen.queryByText(/Disc 1/)).not.toBeInTheDocument()
    })
  })

  describe('track-level empty state', () => {
    it('renders "No tracks yet." when a disc has no tracks', () => {
      render(<Tracklist discs={[makeDisc({ tracks: [] })]} />)
      expect(screen.getByText('No tracks yet.')).toBeInTheDocument()
    })
  })

  describe('track list', () => {
    it('renders each track with its position and title', () => {
      render(
        <Tracklist
          discs={[
            makeDisc({
              tracks: [
                { _key: 't1', position: 'A1', title: 'Smells Like Teen Spirit' },
                { _key: 't2', position: 'A2', title: 'In Bloom' },
              ],
            }),
          ]}
        />,
      )
      expect(screen.getByText('A1')).toBeInTheDocument()
      expect(screen.getByText('Smells Like Teen Spirit')).toBeInTheDocument()
      expect(screen.getByText('A2')).toBeInTheDocument()
      expect(screen.getByText('In Bloom')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has no violations when discs is null', async () => {
      const { container } = render(<Tracklist discs={null} />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no violations with a named disc and tracks', async () => {
      const { container } = render(
        <Tracklist
          discs={[
            makeDisc({
              name: 'Side A',
              tracks: [
                { _key: 't1', position: 'A1', title: 'Track One' },
                { _key: 't2', position: 'A2', title: 'Track Two' },
              ],
            }),
          ]}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no violations with multiple unnamed discs', async () => {
      const { container } = render(
        <Tracklist
          discs={[makeDisc({ _key: 'a', discNumber: 1 }), makeDisc({ _key: 'b', discNumber: 2 })]}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
