import { ThemeProvider, studioTheme } from '@sanity/ui'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps, ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('sanity', () => ({
  set: (value: unknown, path: string[]) => ({ type: 'set', path, value }),
}))

import { LocationSearchInput } from './LocationSearchInput'

function wrapper({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={studioTheme}>{children}</ThemeProvider>
}

const result = {
  place_id: 42,
  lat: '51.5074',
  lon: '-0.1278',
  display_name: 'London, Greater London, England, United Kingdom',
  name: 'London',
  address: { city: 'London', state: 'England', country: 'United Kingdom' },
}

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function renderInput(onChange = vi.fn()) {
  const props = {
    onChange,
    renderDefault: () => <div data-testid="default-fields">default fields</div>,
  } as unknown as ComponentProps<typeof LocationSearchInput>

  render(<LocationSearchInput {...props} />, { wrapper })
  return { onChange }
}

describe('LocationSearchInput', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the default object fields alongside the search panel', () => {
    renderInput()

    expect(screen.getByTestId('default-fields')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
  })

  /**
   * `delay: null` removes the artificial per-keystroke pause that user-event v14 adds by
   * default. Without it, typing 'London' dispatches ~24 DOM events sequentially through
   * the jsdom event loop, which causes this test to intermittently exceed the 5 s vitest
   * timeout on slow CI runners.
   *
   * The per-test timeout is raised to 15 s as an additional safety net for cold runners
   * where React's async state updates (fetch → setResults → re-render) add unpredictable
   * overhead even after typing is made instantaneous.
   */
  it('searches and patches city, state, country and coordinates on select', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse([result])))
    const user = userEvent.setup({ delay: null })
    const { onChange } = renderInput()

    await user.type(screen.getByRole('textbox', { name: 'Search' }), 'London')
    await user.click(screen.getByRole('button', { name: 'Search' }))

    const option = await screen.findByText('London, Greater London, England, United Kingdom')
    await user.click(option)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith([
      { type: 'set', path: ['city'], value: 'London' },
      { type: 'set', path: ['state'], value: 'England' },
      { type: 'set', path: ['country'], value: 'United Kingdom' },
      {
        type: 'set',
        path: ['coordinates'],
        value: { _type: 'geopoint', lat: 51.5074, lng: -0.1278 },
      },
    ])
  }, 15_000)

  it('shows an empty state when no places match', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse([])))
    const user = userEvent.setup()
    renderInput()

    await user.type(screen.getByRole('textbox', { name: 'Search' }), 'Nowhere')
    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(await screen.findByText(/no places found/i)).toBeInTheDocument()
  })
})
