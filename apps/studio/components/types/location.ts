/** Subset of the OpenStreetMap / Nominatim `jsonv2` search response we consume. */
export interface NominatimAddress {
  city?: string
  town?: string
  village?: string
  municipality?: string
  hamlet?: string
  state?: string
  region?: string
  province?: string
  country?: string
  [key: string]: string | undefined
}

export interface NominatimResult {
  place_id: number
  lat: string
  lon: string
  display_name: string
  name?: string
  address?: NominatimAddress
}

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search'

/**
 * Build a Nominatim search URL. Called directly from the browser (Nominatim
 * supports CORS); the browser-sent `Referer` satisfies the usage policy for
 * low-volume Studio lookups.
 */
export function buildNominatimSearchUrl(query: string, limit = 10): string {
  const params = new URLSearchParams({
    q: query,
    format: 'jsonv2',
    addressdetails: '1',
    limit: String(limit),
  })
  return `${NOMINATIM_BASE_URL}?${params.toString()}`
}
