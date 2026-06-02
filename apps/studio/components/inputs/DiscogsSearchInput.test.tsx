import { ThemeProvider, ToastProvider, studioTheme } from '@sanity/ui'
import { render, screen } from '@testing-library/react'
import type { ComponentProps, ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('sanity', () => ({
  set: (value: unknown) => ({ type: 'set', value }),
  unset: () => ({ type: 'unset' }),
  useFormValue: () => undefined,
  useClient: () => ({ fetch: vi.fn().mockResolvedValue(null) }),
  getPublishedId: (id: string) => id,
  useDocumentOperation: () => ({ patch: { execute: vi.fn() } }),
}))

import { DiscogsSearchInput } from './DiscogsSearchInput'
import type { DiscogsValue } from '../types/discogs'

function wrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={studioTheme}>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  )
}

function renderInput(value?: DiscogsValue) {
  const props = {
    value,
    onChange: vi.fn(),
  } as unknown as ComponentProps<typeof DiscogsSearchInput>

  return render(<DiscogsSearchInput {...props} />, { wrapper })
}

describe('DiscogsSearchInput', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the search state without crashing when there is no value', () => {
    renderInput(undefined)

    expect(screen.getByRole('button', { name: 'Search Discogs' })).toBeInTheDocument()
    expect(screen.getByText('Search to link a Discogs release.')).toBeInTheDocument()
  })

  it('renders the linked state when a release is stored', () => {
    renderInput({ _type: 'discogs', releaseId: 12345 })

    expect(screen.getByText('Linked Discogs release')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '12345' })).toHaveAttribute(
      'href',
      'https://www.discogs.com/release/12345',
    )
  })
})
