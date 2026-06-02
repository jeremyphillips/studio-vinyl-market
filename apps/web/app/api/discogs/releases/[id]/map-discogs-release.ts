import type { DiscogsReleaseDetail, DiscogsTrack } from '@vinyl-market/discogs'

export type { DiscogsReleaseDetail, DiscogsTrack }

interface RawTrack {
  type_?: string
  position?: string
  title?: string
  sub_tracks?: RawTrack[]
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

export function mapDiscogsReleaseDetail(raw: {
  id?: number
  tracklist?: RawTrack[]
}): DiscogsReleaseDetail {
  const tracklist = (raw.tracklist ?? []).flatMap(flattenTrack)

  return {
    id: raw.id as number,
    tracklist,
  }
}
