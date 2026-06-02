import { ThemeProvider, ToastProvider, studioTheme } from '@sanity/ui'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const patchExecute = vi.fn()
const formValues: Record<string, unknown> = {}

vi.mock('sanity', () => ({
  useFormValue: (path: string[]) => formValues[path.join('.')],
  useDocumentOperation: () => ({ patch: { execute: patchExecute } }),
  getPublishedId: (id: string) => id.replace(/^drafts\./, ''),
}))

vi.mock('../types/discogs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../types/discogs')>()
  return {
    ...actual,
    buildDiscogsReleaseUrl: (id: number) => `http://test.local/releases/${id}`,
  }
})

import { DiscogsImportPanel } from './DiscogsImportPanel'

function wrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={studioTheme}>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  )
}

const detail = {
  id: 123,
  tracklist: [
    { position: 'A1', title: 'One' },
    { position: 'B2', title: 'Two' },
  ],
}

function stubFetch(payload: unknown, status = 200) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(payload), {
        status,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  )
}

describe('DiscogsImportPanel', () => {
  beforeEach(() => {
    patchExecute.mockClear()
    for (const key of Object.keys(formValues)) delete formValues[key]
    formValues._id = 'drafts.release-1'
    formValues._type = 'release'
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches and renders the tracklist row', async () => {
    stubFetch(detail)
    const user = userEvent.setup()
    render(<DiscogsImportPanel releaseId={123} />, { wrapper })

    await user.click(screen.getByRole('button', { name: /fetch from discogs/i }))

    expect(await screen.findByText(/2 tracks/)).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('warns when discs already contain tracks', async () => {
    formValues.discs = [{ tracks: [{}, {}, {}] }]
    stubFetch(detail)
    const user = userEvent.setup()
    render(<DiscogsImportPanel releaseId={123} />, { wrapper })

    await user.click(screen.getByRole('button', { name: /fetch from discogs/i }))

    expect(await screen.findByText(/replaces 3 existing tracks/i)).toBeInTheDocument()
  })

  it('disables import when the tracklist row is unchecked', async () => {
    stubFetch(detail)
    const user = userEvent.setup()
    render(<DiscogsImportPanel releaseId={123} />, { wrapper })

    await user.click(screen.getByRole('button', { name: /fetch from discogs/i }))
    await screen.findByText(/2 tracks/)

    const importButton = screen.getByRole('button', { name: /import selected/i })
    expect(importButton).toBeEnabled()

    await user.click(screen.getByRole('checkbox'))
    expect(importButton).toBeDisabled()
  })

  it('writes a single disc to the document on import', async () => {
    stubFetch(detail)
    const user = userEvent.setup()
    render(<DiscogsImportPanel releaseId={123} />, { wrapper })

    await user.click(screen.getByRole('button', { name: /fetch from discogs/i }))
    await screen.findByText(/2 tracks/)
    await user.click(screen.getByRole('button', { name: /import selected/i }))

    expect(patchExecute).toHaveBeenCalledTimes(1)
    const [patches] = patchExecute.mock.calls[0] as [Array<{ set: { discs: unknown[] } }>]
    expect(patches).toHaveLength(1)

    const discs = patches[0].set.discs as Array<{
      _key: string
      discNumber: number
      tracks: Array<{ _key: string; position: string; title: string }>
    }>
    expect(discs).toHaveLength(1)
    expect(discs[0].discNumber).toBe(1)
    expect(discs[0]._key).toEqual(expect.any(String))
    expect(discs[0].tracks).toEqual([
      expect.objectContaining({ position: 'A1', title: 'One' }),
      expect.objectContaining({ position: 'B2', title: 'Two' }),
    ])
    expect(discs[0].tracks[0]._key).toEqual(expect.any(String))
  })
})
