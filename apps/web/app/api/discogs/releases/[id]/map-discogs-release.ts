import type { DiscogsFormat, DiscogsReleaseDetail, DiscogsTrack } from '@vinyl-market/discogs'

export type { DiscogsFormat, DiscogsReleaseDetail, DiscogsTrack }

interface RawTrack {
  type_?: string
  position?: string
  title?: string
  sub_tracks?: RawTrack[]
}

interface RawFormat {
  name?: string
  qty?: string
  descriptions?: string[]
  text?: string
}

function flattenTrack(raw: RawTrack): DiscogsTrack[] {
  if (raw.type_ === 'heading') return []

  if (Array.isArray(raw.sub_tracks) && raw.sub_tracks.length > 0) {
    return raw.sub_tracks.flatMap(flattenTrack)
  }

  const title = (raw.title ?? '').trim()
  if (!title) return []

  return [{ position: (raw.position ?? '').trim(), title }]
}

function mapFormat(raw: RawFormat): DiscogsFormat {
  return {
    name: (raw.name ?? '').trim(),
    qty: (raw.qty ?? '1').trim(),
    descriptions: Array.isArray(raw.descriptions) ? raw.descriptions.map(String) : [],
    ...(raw.text !== undefined && raw.text !== null ? { text: String(raw.text) } : {}),
  }
}

export function mapDiscogsReleaseDetail(raw: {
  id?: number
  tracklist?: RawTrack[]
  formats?: RawFormat[]
}): DiscogsReleaseDetail {
  const tracklist = (raw.tracklist ?? []).flatMap(flattenTrack)
  const formats = Array.isArray(raw.formats) ? raw.formats.map(mapFormat) : []

  return {
    id: raw.id as number,
    tracklist,
    formats,
  }
}
