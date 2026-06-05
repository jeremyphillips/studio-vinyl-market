import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'

vi.mock('@/components/catalog/release-card/release-card.client', () => ({
  ReleaseCard: ({
    release,
    priority,
  }: {
    release: { releaseName: string }
    priority?: boolean
  }) => (
    <div data-testid="release-card" data-priority={String(priority ?? false)}>
      {release.releaseName}
    </div>
  ),
}))

import { ReleaseGrid } from './release-grid'

const releases = [
  { _id: '1', releaseName: 'Kind of Blue', slug: 'kind-of-blue', classification: 'LP' as const },
  { _id: '2', releaseName: 'Time Out', slug: 'time-out', classification: 'LP' as const },
  {
    _id: '3',
    releaseName: 'A Love Supreme',
    slug: 'a-love-supreme',
    classification: 'LP' as const,
  },
]

describe('ReleaseGrid', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<ReleaseGrid releases={releases} />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('renders one card per release', () => {
    render(<ReleaseGrid releases={releases} />)
    expect(screen.getAllByTestId('release-card')).toHaveLength(3)
  })

  it('shows the default empty message when releases is empty', () => {
    render(<ReleaseGrid releases={[]} />)
    expect(screen.getByText('No releases yet.')).toBeInTheDocument()
  })

  it('shows a custom empty message', () => {
    render(<ReleaseGrid releases={[]} emptyMessage="No releases published yet." />)
    expect(screen.getByText('No releases published yet.')).toBeInTheDocument()
  })

  it('marks only the first card as priority by default', () => {
    render(<ReleaseGrid releases={releases} />)
    const cards = screen.getAllByTestId('release-card')
    expect(cards[0]).toHaveAttribute('data-priority', 'true')
    expect(cards[1]).toHaveAttribute('data-priority', 'false')
    expect(cards[2]).toHaveAttribute('data-priority', 'false')
  })

  it('marks the first N cards as priority when priorityCount is set', () => {
    render(<ReleaseGrid releases={releases} priorityCount={2} />)
    const cards = screen.getAllByTestId('release-card')
    expect(cards[0]).toHaveAttribute('data-priority', 'true')
    expect(cards[1]).toHaveAttribute('data-priority', 'true')
    expect(cards[2]).toHaveAttribute('data-priority', 'false')
  })
})
