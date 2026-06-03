import type { NominatimResult } from '../components/types/location'

export interface LocationCoordinates {
  lat: number
  lng: number
}

export interface LocationPatch {
  city?: string
  state?: string
  country?: string
  coordinates?: LocationCoordinates
}

/** Nominatim address keys that can stand in for a city, most specific first. */
const CITY_KEYS = ['city', 'town', 'village', 'municipality', 'hamlet'] as const

/** Nominatim address keys that can stand in for a state/region, most specific first. */
const STATE_KEYS = ['state', 'province', 'region'] as const

function firstAddressValue(
  address: NominatimResult['address'],
  keys: readonly string[],
): string | undefined {
  if (!address) return undefined
  for (const key of keys) {
    const value = address[key]
    if (value) return value
  }
  return undefined
}

function parseCoordinates(result: NominatimResult): LocationCoordinates | undefined {
  const lat = Number.parseFloat(result.lat)
  const lng = Number.parseFloat(result.lon)
  if (Number.isNaN(lat) || Number.isNaN(lng)) return undefined
  return { lat, lng }
}

/**
 * Map a Nominatim search result to a partial location patch. Fields that the
 * result does not provide are `undefined` and must not overwrite manual values.
 */
export function adaptNominatimResult(result: NominatimResult): LocationPatch {
  return {
    city: firstAddressValue(result.address, CITY_KEYS),
    state: firstAddressValue(result.address, STATE_KEYS),
    country: result.address?.country,
    coordinates: parseCoordinates(result),
  }
}
