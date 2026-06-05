import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const formValues: Record<string, unknown> = {}
const artistName = { current: undefined as string | undefined }
const searchMock = vi.fn()
const resetMock = vi.fn()

vi.mock('sanity', () => ({
  set: (value: unknown) => ({ type: 'set', value }),
  unset: () => ({ type: 'unset' }),
  useFormValue: (path: string[]) => formValues[path.join('.')],
}))

vi.mock('../hooks/useReferencedDocumentField', () => ({
  useReferencedDocumentField: () => artistName.current,
}))

vi.mock('../hooks/useDiscogsSearch', () => ({
  useDiscogsSearch: () => ({
    results: null,
    loading: false,
    error: null,
    search: searchMock,
    reset: resetMock,
  }),
}))

import { useDiscogsReleaseLink } from './useDiscogsReleaseLink'
import type { DiscogsValue } from '../types/discogs'

function setup(value?: DiscogsValue) {
  const onChange = vi.fn()
  const view = renderHook(
    ({ value: v }: { value?: DiscogsValue }) => useDiscogsReleaseLink({ value: v, onChange }),
    { initialProps: { value } },
  )
  return { ...view, onChange }
}

describe('useDiscogsReleaseLink', () => {
  beforeEach(() => {
    for (const key of Object.keys(formValues)) delete formValues[key]
    artistName.current = undefined
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('seeds the query from artist and release name', () => {
    formValues['releaseName'] = 'OK Computer'
    formValues['artist'] = { _ref: 'artist-1' }
    artistName.current = 'Radiohead'

    const { result } = setup({ _type: 'discogs' })

    expect(result.current.query).toBe('Radiohead OK Computer')
  })

  it('starts in search mode when nothing is linked', () => {
    const { result } = setup(undefined)

    expect(result.current.showSearch).toBe(true)
    expect(result.current.hasValue).toBe(false)
  })

  it('starts in linked mode when a release is already stored', () => {
    const { result } = setup({ _type: 'discogs', releaseId: 42 })

    expect(result.current.showSearch).toBe(false)
    expect(result.current.hasValue).toBe(true)
    expect(result.current.selectedId).toBe(42)
  })

  it('stores the selection, hides search, and resets on select', () => {
    const { result, onChange } = setup(undefined)

    act(() => {
      result.current.onSelect({ id: 7, masterId: 99 } as never)
    })

    expect(result.current.selectedId).toBe(7)
    expect(result.current.showSearch).toBe(false)
    expect(onChange).toHaveBeenCalledWith({
      type: 'set',
      value: { _type: 'discogs', releaseId: 7, masterId: 99 },
    })
    expect(resetMock).toHaveBeenCalled()
  })

  it('unsets the value and reopens search on clear', () => {
    formValues['releaseName'] = 'Kid A'
    const { result, onChange } = setup({ _type: 'discogs', releaseId: 7 })

    act(() => {
      result.current.onClear()
    })

    expect(result.current.selectedId).toBeNull()
    expect(result.current.showSearch).toBe(true)
    expect(result.current.query).toBe('Kid A')
    expect(onChange).toHaveBeenCalledWith({ type: 'unset' })
  })

  it('reopens search on search-again without clearing the value', () => {
    const { result, onChange } = setup({ _type: 'discogs', releaseId: 7 })

    act(() => {
      result.current.onSearchAgain()
    })

    expect(result.current.showSearch).toBe(true)
    expect(result.current.hasValue).toBe(true)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('forwards the current query to search', () => {
    formValues['releaseName'] = 'Amnesiac'
    const { result } = setup(undefined)

    act(() => {
      result.current.onSearch()
    })

    expect(searchMock).toHaveBeenCalledWith('Amnesiac')
  })
})
