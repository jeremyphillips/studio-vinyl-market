import { corsJson, fetchDiscogs } from '../../_lib/discogs'

import { mapDiscogsReleaseDetail } from './map-discogs-release'

export type { DiscogsReleaseDetail, DiscogsTrack } from './map-discogs-release'

export { OPTIONS } from '../../_lib/discogs'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^\d+$/.test(id)) {
    return corsJson({ error: 'A numeric release id is required' }, { status: 400 })
  }

  const result = await fetchDiscogs(`/releases/${id}`)
  if (!result.ok) return result.response

  return corsJson(
    mapDiscogsReleaseDetail(result.data as Parameters<typeof mapDiscogsReleaseDetail>[0]),
  )
}
