import { describe, expect, it } from 'vitest'

import { mapDiscogsReleaseDetail } from './map-discogs-release'

describe('mapDiscogsReleaseDetail', () => {
  it('keeps plain tracks with positions verbatim', () => {
    const result = mapDiscogsReleaseDetail({
      id: 1,
      tracklist: [
        { type_: 'track', position: 'A1', title: 'One' },
        { type_: 'track', position: 'B2', title: 'Two' },
      ],
    })

    expect(result).toEqual({
      id: 1,
      tracklist: [
        { position: 'A1', title: 'One' },
        { position: 'B2', title: 'Two' },
      ],
    })
  })

  it('skips heading rows', () => {
    const result = mapDiscogsReleaseDetail({
      id: 2,
      tracklist: [
        { type_: 'heading', title: 'Side A' },
        { type_: 'track', position: 'A1', title: 'One' },
      ],
    })

    expect(result.tracklist).toEqual([{ position: 'A1', title: 'One' }])
  })

  it('flattens index tracks into their sub_tracks', () => {
    const result = mapDiscogsReleaseDetail({
      id: 3,
      tracklist: [
        {
          type_: 'index',
          title: 'Medley',
          sub_tracks: [
            { type_: 'track', position: 'A1.a', title: 'Part 1' },
            { type_: 'track', position: 'A1.b', title: 'Part 2' },
          ],
        },
      ],
    })

    expect(result.tracklist).toEqual([
      { position: 'A1.a', title: 'Part 1' },
      { position: 'A1.b', title: 'Part 2' },
    ])
  })

  it('drops tracks without a title and trims whitespace', () => {
    const result = mapDiscogsReleaseDetail({
      id: 4,
      tracklist: [
        { type_: 'track', position: ' A1 ', title: '  Padded  ' },
        { type_: 'track', position: 'A2', title: '   ' },
      ],
    })

    expect(result.tracklist).toEqual([{ position: 'A1', title: 'Padded' }])
  })

  it('defaults a missing tracklist to an empty array', () => {
    expect(mapDiscogsReleaseDetail({ id: 5 })).toEqual({ id: 5, tracklist: [] })
  })
})
