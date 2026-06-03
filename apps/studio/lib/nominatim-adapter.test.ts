import { describe, expect, it } from 'vitest'
import type { NominatimResult } from '../components/types/location'
import { adaptNominatimResult } from './nominatim-adapter'

function makeResult(overrides: Partial<NominatimResult> = {}): NominatimResult {
  return {
    place_id: 1,
    lat: '51.5074',
    lon: '-0.1278',
    display_name: 'London, Greater London, England, United Kingdom',
    ...overrides,
  }
}

describe('adaptNominatimResult', () => {
  it('maps city, state and country from the address block', () => {
    const result = makeResult({
      address: { city: 'London', state: 'England', country: 'United Kingdom' },
    })
    expect(adaptNominatimResult(result)).toEqual({
      city: 'London',
      state: 'England',
      country: 'United Kingdom',
      coordinates: { lat: 51.5074, lng: -0.1278 },
    })
  })

  describe('city fallbacks', () => {
    it.each([['town'], ['village'], ['municipality'], ['hamlet']])(
      'uses %s when city is absent',
      (key) => {
        const result = makeResult({ address: { [key]: 'Somewhere' } })
        expect(adaptNominatimResult(result).city).toBe('Somewhere')
      },
    )

    it('prefers city over town', () => {
      const result = makeResult({ address: { city: 'Real City', town: 'Small Town' } })
      expect(adaptNominatimResult(result).city).toBe('Real City')
    })
  })

  describe('state fallbacks', () => {
    it.each([['province'], ['region']])('uses %s when state is absent', (key) => {
      const result = makeResult({ address: { [key]: 'Some Region' } })
      expect(adaptNominatimResult(result).state).toBe('Some Region')
    })
  })

  it('leaves fields undefined when the address block is missing', () => {
    const result = makeResult({ address: undefined })
    expect(adaptNominatimResult(result)).toEqual({
      city: undefined,
      state: undefined,
      country: undefined,
      coordinates: { lat: 51.5074, lng: -0.1278 },
    })
  })

  it('parses coordinates from string lat/lon', () => {
    const result = makeResult({ lat: '40.7128', lon: '-74.006' })
    expect(adaptNominatimResult(result).coordinates).toEqual({ lat: 40.7128, lng: -74.006 })
  })

  it('returns undefined coordinates when lat/lon are not numeric', () => {
    const result = makeResult({ lat: 'not-a-number', lon: '' })
    expect(adaptNominatimResult(result).coordinates).toBeUndefined()
  })
})
