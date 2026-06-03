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
  formats: [],
}

const detailWithFormats = {
  id: 123,
  tracklist: [
    { position: 'A1', title: 'One' },
    { position: 'B2', title: 'Two' },
  ],
  formats: [
    {
      name: 'Vinyl',
      qty: '1',
      descriptions: ['LP', 'Reissue', 'Stereo', '33 ⅓ RPM', '12"'],
    },
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
    expect(screen.getByRole('checkbox', { name: /tracklist/i })).toBeChecked()
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

    await user.click(screen.getByRole('checkbox', { name: /tracklist/i }))
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
    const [patches] = patchExecute.mock.calls[0] as [Array<{ set: Record<string, unknown> }>]
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

  describe('all up to date', () => {
    it('shows a success message and hides rows when all fields already match', async () => {
      formValues.discs = [
        {
          tracks: [
            { position: 'A1', title: 'One' },
            { position: 'B2', title: 'Two' },
          ],
        },
      ]
      stubFetch(detail)
      const user = userEvent.setup()
      render(<DiscogsImportPanel releaseId={123} />, { wrapper })

      await user.click(screen.getByRole('button', { name: /fetch from discogs/i }))

      expect(await screen.findByText(/all fields are already up to date/i)).toBeInTheDocument()
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /import selected/i })).not.toBeInTheDocument()
    })

    it('shows a Done button that resets to fetch state', async () => {
      formValues.discs = [
        {
          tracks: [
            { position: 'A1', title: 'One' },
            { position: 'B2', title: 'Two' },
          ],
        },
      ]
      stubFetch(detail)
      const user = userEvent.setup()
      render(<DiscogsImportPanel releaseId={123} />, { wrapper })

      await user.click(screen.getByRole('button', { name: /fetch from discogs/i }))
      await screen.findByText(/all fields are already up to date/i)

      await user.click(screen.getByRole('button', { name: /done/i }))

      expect(screen.getByRole('button', { name: /fetch from discogs/i })).toBeInTheDocument()
    })
  })

  describe('tracklist match detection', () => {
    it('disables tracklist checkbox when incoming tracks match the single existing disc', async () => {
      formValues.discs = [
        {
          tracks: [
            { position: 'A1', title: 'One' },
            { position: 'B2', title: 'Two' },
          ],
        },
      ]
      // Use detailWithFormats so other fields have new data — keeps rows visible
      // while the tracklist checkbox alone is disabled due to matching
      stubFetch(detailWithFormats)
      const user = userEvent.setup()
      render(<DiscogsImportPanel releaseId={123} />, { wrapper })

      await user.click(screen.getByRole('button', { name: /fetch from discogs/i }))
      await screen.findByText(/2 tracks/)

      expect(screen.getByRole('checkbox', { name: /tracklist/i })).toBeDisabled()
    })

    it('enables tracklist checkbox when incoming tracks differ from the single existing disc', async () => {
      formValues.discs = [{ tracks: [{ position: 'A1', title: 'Different Title' }] }]
      stubFetch(detail)
      const user = userEvent.setup()
      render(<DiscogsImportPanel releaseId={123} />, { wrapper })

      await user.click(screen.getByRole('button', { name: /fetch from discogs/i }))
      await screen.findByText(/2 tracks/)

      expect(screen.getByRole('checkbox', { name: /tracklist/i })).toBeEnabled()
    })

    it('suppresses the overwrite warning when the tracklist already matches', async () => {
      formValues.discs = [
        {
          tracks: [
            { position: 'A1', title: 'One' },
            { position: 'B2', title: 'Two' },
          ],
        },
      ]
      // Use detailWithFormats to keep rows visible; tracklist warning should be absent
      stubFetch(detailWithFormats)
      const user = userEvent.setup()
      render(<DiscogsImportPanel releaseId={123} />, { wrapper })

      await user.click(screen.getByRole('button', { name: /fetch from discogs/i }))
      await screen.findByText(/2 tracks/)

      expect(screen.queryByText(/replaces.*track/i)).not.toBeInTheDocument()
    })

    it('enables tracklist checkbox when document has multiple discs', async () => {
      formValues.discs = [
        {
          tracks: [
            { position: 'A1', title: 'One' },
            { position: 'B2', title: 'Two' },
          ],
        },
        { tracks: [{ position: 'C1', title: 'Three' }] },
      ]
      stubFetch(detail)
      const user = userEvent.setup()
      render(<DiscogsImportPanel releaseId={123} />, { wrapper })

      await user.click(screen.getByRole('button', { name: /fetch from discogs/i }))
      await screen.findByText(/2 tracks/)

      expect(screen.getByRole('checkbox', { name: /tracklist/i })).toBeEnabled()
    })
  })

  describe('scalar field match detection', () => {
    it('disables mediaType checkbox when incoming value matches existing', async () => {
      formValues.mediaType = 'vinyl'
      stubFetch(detailWithFormats)
      const user = userEvent.setup()
      render(<DiscogsImportPanel releaseId={123} />, { wrapper })

      await user.click(screen.getByRole('button', { name: /fetch from discogs/i }))
      await screen.findByText(/2 tracks/)

      expect(screen.getByRole('checkbox', { name: /media type/i })).toBeDisabled()
    })

    it('enables mediaType checkbox when incoming value differs from existing', async () => {
      formValues.mediaType = 'cd'
      stubFetch(detailWithFormats)
      const user = userEvent.setup()
      render(<DiscogsImportPanel releaseId={123} />, { wrapper })

      await user.click(screen.getByRole('button', { name: /fetch from discogs/i }))
      await screen.findByText(/2 tracks/)

      expect(screen.getByRole('checkbox', { name: /media type/i })).toBeEnabled()
    })

    it('disables classification checkbox when incoming value matches existing', async () => {
      formValues.classification = 'LP'
      stubFetch(detailWithFormats)
      const user = userEvent.setup()
      render(<DiscogsImportPanel releaseId={123} />, { wrapper })

      await user.click(screen.getByRole('button', { name: /fetch from discogs/i }))
      await screen.findByText(/2 tracks/)

      expect(screen.getByRole('checkbox', { name: /classification/i })).toBeDisabled()
    })

    it('disables channels checkbox when incoming value matches existing', async () => {
      formValues.channels = 'stereo'
      stubFetch(detailWithFormats)
      const user = userEvent.setup()
      render(<DiscogsImportPanel releaseId={123} />, { wrapper })

      await user.click(screen.getByRole('button', { name: /fetch from discogs/i }))
      await screen.findByText(/2 tracks/)

      expect(screen.getByRole('checkbox', { name: /channels/i })).toBeDisabled()
    })

    it('enables channels checkbox when incoming value differs from existing', async () => {
      formValues.channels = 'mono'
      stubFetch(detailWithFormats)
      const user = userEvent.setup()
      render(<DiscogsImportPanel releaseId={123} />, { wrapper })

      await user.click(screen.getByRole('button', { name: /fetch from discogs/i }))
      await screen.findByText(/2 tracks/)

      expect(screen.getByRole('checkbox', { name: /channels/i })).toBeEnabled()
    })

    it('excludes matched fields from the patch even when checkbox state is true', async () => {
      formValues.mediaType = 'vinyl'
      formValues.classification = 'LP'
      stubFetch(detailWithFormats)
      const user = userEvent.setup()
      render(<DiscogsImportPanel releaseId={123} />, { wrapper })

      await user.click(screen.getByRole('button', { name: /fetch from discogs/i }))
      await screen.findByText(/2 tracks/)
      await user.click(screen.getByRole('button', { name: /import selected/i }))

      const [patches] = patchExecute.mock.calls[0] as [Array<{ set: Record<string, unknown> }>]
      const { set } = patches[0]

      expect(set.mediaType).toBeUndefined()
      expect(set.classification).toBeUndefined()
      expect(set.speed).toBe('33')
    })
  })

  describe('format field rows', () => {
    it('disables format checkboxes when formats is empty', async () => {
      stubFetch(detail)
      const user = userEvent.setup()
      render(<DiscogsImportPanel releaseId={123} />, { wrapper })

      await user.click(screen.getByRole('button', { name: /fetch from discogs/i }))
      await screen.findByText(/2 tracks/)

      expect(screen.getByRole('checkbox', { name: /media type/i })).toBeDisabled()
      expect(screen.getByRole('checkbox', { name: /classification/i })).toBeDisabled()
      expect(screen.getByRole('checkbox', { name: /speed/i })).toBeDisabled()
      expect(screen.getByRole('checkbox', { name: /size/i })).toBeDisabled()
      expect(screen.getByRole('checkbox', { name: /channels/i })).toBeDisabled()
      expect(screen.getByRole('checkbox', { name: /descriptions/i })).toBeDisabled()
    })

    it('enables format checkboxes and shows previews when format data is present', async () => {
      stubFetch(detailWithFormats)
      const user = userEvent.setup()
      render(<DiscogsImportPanel releaseId={123} />, { wrapper })

      await user.click(screen.getByRole('button', { name: /fetch from discogs/i }))
      await screen.findByText(/2 tracks/)

      expect(screen.getByRole('checkbox', { name: /media type/i })).toBeEnabled()
      expect(screen.getByRole('checkbox', { name: /classification/i })).toBeEnabled()
      expect(screen.getByRole('checkbox', { name: /speed/i })).toBeEnabled()
      expect(screen.getByRole('checkbox', { name: /size/i })).toBeEnabled()
      expect(screen.getByRole('checkbox', { name: /channels/i })).toBeEnabled()
      expect(screen.getByRole('checkbox', { name: /descriptions/i })).toBeEnabled()

      expect(screen.getByText('Vinyl')).toBeInTheDocument()
      expect(screen.getByText('LP')).toBeInTheDocument()
      expect(screen.getByText('33⅓ RPM')).toBeInTheDocument()
      expect(screen.getByText('Stereo')).toBeInTheDocument()
      expect(screen.getByText('Reissue')).toBeInTheDocument()
    })

    it('includes format fields in the patch when all are checked', async () => {
      stubFetch(detailWithFormats)
      const user = userEvent.setup()
      render(<DiscogsImportPanel releaseId={123} />, { wrapper })

      await user.click(screen.getByRole('button', { name: /fetch from discogs/i }))
      await screen.findByText(/2 tracks/)
      await user.click(screen.getByRole('button', { name: /import selected/i }))

      expect(patchExecute).toHaveBeenCalledTimes(1)
      const [patches] = patchExecute.mock.calls[0] as [Array<{ set: Record<string, unknown> }>]
      const { set } = patches[0]

      expect(set.mediaType).toBe('vinyl')
      expect(set.classification).toBe('LP')
      expect(set.speed).toBe('33')
      expect(set.size).toBe('12"')
      expect(set.channels).toBe('stereo')
      expect(set.descriptions).toEqual(['reissue'])
      expect(set.discs).toBeDefined()
    })

    it('excludes format fields from patch when their checkboxes are unchecked', async () => {
      stubFetch(detailWithFormats)
      const user = userEvent.setup()
      render(<DiscogsImportPanel releaseId={123} />, { wrapper })

      await user.click(screen.getByRole('button', { name: /fetch from discogs/i }))
      await screen.findByText(/2 tracks/)

      await user.click(screen.getByRole('checkbox', { name: /media type/i }))
      await user.click(screen.getByRole('checkbox', { name: /classification/i }))
      await user.click(screen.getByRole('button', { name: /import selected/i }))

      const [patches] = patchExecute.mock.calls[0] as [Array<{ set: Record<string, unknown> }>]
      const { set } = patches[0]

      expect(set.mediaType).toBeUndefined()
      expect(set.classification).toBeUndefined()
      expect(set.speed).toBe('33')
    })

    it('shows overwrite warning when format field already has a value', async () => {
      formValues.mediaType = 'cd'
      stubFetch(detailWithFormats)
      const user = userEvent.setup()
      render(<DiscogsImportPanel releaseId={123} />, { wrapper })

      await user.click(screen.getByRole('button', { name: /fetch from discogs/i }))
      await screen.findByText(/2 tracks/)

      expect(screen.getByText('Replaces current value.')).toBeInTheDocument()
    })
  })
})
