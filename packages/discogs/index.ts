export interface DiscogsResult {
  id: number
  masterId: number | null
  title: string
  year: string | null
  country: string | null
  format: string[]
  label: string[]
  catno: string | null
  thumb: string | null
  coverImage: string | null
  resourceUrl: string
}

export interface DiscogsSearchResponse {
  results: DiscogsResult[]
  pagination: {
    page: number
    pages: number
    items: number
    perPage: number
  }
}

export interface DiscogsTrack {
  position: string
  title: string
}

export interface DiscogsReleaseDetail {
  id: number
  tracklist: DiscogsTrack[]
}
