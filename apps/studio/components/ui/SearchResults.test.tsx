import { ThemeProvider, studioTheme } from '@sanity/ui'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SearchResults, type SearchResultsProps } from './SearchResults'

function wrapper({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={studioTheme}>{children}</ThemeProvider>
}

interface Row {
  id: number
  title: string
}

function renderResults(props: Partial<SearchResultsProps<Row>> = {}) {
  const onSelect = vi.fn()
  render(
    <SearchResults<Row>
      results={null}
      loading={false}
      error={null}
      getKey={(row) => row.id}
      renderItem={(row) => ({ title: row.title })}
      onSelect={onSelect}
      emptyMessage="No results found."
      {...props}
    />,
    { wrapper },
  )
  return { onSelect }
}

describe('SearchResults', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the error banner when there is an error', () => {
    renderResults({ error: 'Something broke' })

    expect(screen.getByText('Something broke')).toBeInTheDocument()
  })

  it('renders the empty message when a search returns no rows', () => {
    renderResults({ results: [] })

    expect(screen.getByText('No results found.')).toBeInTheDocument()
  })

  it('renders each row and calls onSelect when one is clicked', async () => {
    const user = userEvent.setup()
    const { onSelect } = renderResults({ results: [{ id: 1, title: 'First' }] })

    const row = screen.getByRole('button', { name: /first/i })
    await user.click(row)

    expect(onSelect).toHaveBeenCalledWith({ id: 1, title: 'First' })
  })

  it('shows the idle prompt before the first search when showInitial is true', () => {
    renderResults({ initialMessage: 'Search to begin.', showInitial: true })

    expect(screen.getByText('Search to begin.')).toBeInTheDocument()
  })

  it('omits the idle prompt when showInitial is false', () => {
    renderResults({ initialMessage: 'Search to begin.', showInitial: false })

    expect(screen.queryByText('Search to begin.')).not.toBeInTheDocument()
  })

  it('hides the idle prompt while loading', () => {
    renderResults({ initialMessage: 'Search to begin.', showInitial: true, loading: true })

    expect(screen.queryByText('Search to begin.')).not.toBeInTheDocument()
  })
})
