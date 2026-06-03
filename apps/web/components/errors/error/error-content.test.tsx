import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'

import { ErrorContent } from './error-content'
import { expectCatalogueEscapeLinks, mockConsoleError } from './error.test-utils'

beforeEach(() => {
  mockConsoleError()
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('ErrorContent', () => {
  it('renders default copy and a single main heading', () => {
    render(<ErrorContent error={new Error('boom')} reset={vi.fn()} />)

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Something went wrong')
    expect(
      screen.getByText('We couldn’t load this page. Try again, or head back to the catalogue.'),
    ).toBeInTheDocument()
  })

  it('renders custom title and description', () => {
    render(
      <ErrorContent
        error={new Error('boom')}
        reset={vi.fn()}
        title="Catalogue unavailable"
        description="Sanity is temporarily unreachable."
      />,
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Catalogue unavailable')
    expect(screen.getByText('Sanity is temporarily unreachable.')).toBeInTheDocument()
  })

  it('calls reset when Try again is clicked', async () => {
    const user = userEvent.setup()
    const reset = vi.fn()

    render(<ErrorContent error={new Error('boom')} reset={reset} />)
    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(reset).toHaveBeenCalledOnce()
  })

  it('renders catalogue escape links', () => {
    render(<ErrorContent error={new Error('boom')} reset={vi.fn()} />)

    expect(screen.getByRole('link', { name: 'Back to home' })).toBeInTheDocument()
    expectCatalogueEscapeLinks()
  })

  it('logs the error on mount', () => {
    const error = new Error('boom')

    render(<ErrorContent error={error} reset={vi.fn()} />)

    expect(console.error).toHaveBeenCalledWith(error)
  })

  it('shows development details in development', () => {
    vi.stubEnv('NODE_ENV', 'development')
    const error = new Error('Sanity fetch failed')
    error.stack = 'Error: Sanity fetch failed\n    at page.tsx:10'

    render(<ErrorContent error={error} reset={vi.fn()} />)

    expect(screen.getByText('Development details')).toBeInTheDocument()
    expect(screen.getByText(/Sanity fetch failed/)).toBeInTheDocument()
    expect(screen.getByText(/at page\.tsx:10/)).toBeInTheDocument()
  })

  it('shows digest in development when provided', () => {
    vi.stubEnv('NODE_ENV', 'development')
    const error = Object.assign(new Error('boom'), { digest: 'abc123' })

    render(<ErrorContent error={error} reset={vi.fn()} />)

    expect(screen.getByText('Digest: abc123')).toBeInTheDocument()
  })

  it('hides development details in production', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const error = new Error('Sanity fetch failed')

    render(<ErrorContent error={error} reset={vi.fn()} />)

    expect(screen.queryByText('Development details')).not.toBeInTheDocument()
    expect(screen.queryByText('Sanity fetch failed')).not.toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<ErrorContent error={new Error('boom')} reset={vi.fn()} />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
