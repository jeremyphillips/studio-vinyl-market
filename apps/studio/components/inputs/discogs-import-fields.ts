import {
  releaseChannelsOptions,
  releaseClassificationOptions,
  releaseDescriptionOptions,
  releaseMediaTypeOptions,
  releaseSpeedOptions,
} from '@vinyl-market/release-constants'
import type { DiscogsReleasePatch } from '../../lib/discogs-adapter'
import type { DiscogsTrack } from '../types/discogs'

export interface ExistingDisc {
  tracks?: unknown[]
}

export interface ExistingReleaseValues {
  discs: ExistingDisc[] | undefined
  mediaType: string | undefined
  classification: string | undefined
  speed: string | undefined
  size: string | undefined
  channels: string | undefined
  descriptions: string[] | undefined
}

export type DiscogsImportFieldKey =
  | 'discs'
  | 'mediaType'
  | 'classification'
  | 'speed'
  | 'size'
  | 'channels'
  | 'descriptions'

export interface DiscogsImportField {
  key: DiscogsImportFieldKey
  label: string
  summary?: string
  /** True when there is importable data that differs from the existing value. */
  isNew: boolean
  warning?: string
  /** Value written to the document when this field is imported. */
  value: unknown
}

const REPLACE_VALUE_WARNING = 'Replaces current value.'

const MEDIA_TYPE_LABEL = Object.fromEntries(releaseMediaTypeOptions.map((o) => [o.value, o.title]))
const CLASSIFICATION_LABEL = Object.fromEntries(
  releaseClassificationOptions.map((o) => [o.value, o.title]),
)
const SPEED_LABEL = Object.fromEntries(releaseSpeedOptions.map((o) => [o.value, o.title]))
const CHANNELS_LABEL = Object.fromEntries(releaseChannelsOptions.map((o) => [o.value, o.title]))
const DESCRIPTION_LABEL = Object.fromEntries(
  releaseDescriptionOptions.map((o) => [o.value, o.title]),
)

export function countExistingTracks(discs: ExistingDisc[] | undefined): number {
  if (!Array.isArray(discs)) return 0
  return discs.reduce(
    (total, disc) => total + (Array.isArray(disc?.tracks) ? disc.tracks.length : 0),
    0,
  )
}

/**
 * Returns true only when there is exactly one existing disc and its tracks
 * match the incoming tracklist exactly (position + title, in order).
 * Multi-disc documents always return false — the import always collapses to
 * one disc, which is definitionally a change.
 */
export function tracklistMatchesSingleDisc(
  existing: ExistingDisc[] | undefined,
  incoming: DiscogsTrack[],
): boolean {
  if (!Array.isArray(existing) || existing.length !== 1) return false
  const existingTracks = (existing[0].tracks ?? []) as { position?: string; title?: string }[]
  if (existingTracks.length !== incoming.length) return false
  return incoming.every(
    (t, i) => t.position === existingTracks[i].position && t.title === existingTracks[i].title,
  )
}

function buildTracklistSummary(tracklist: DiscogsTrack[]): string {
  if (tracklist.length === 0) return 'No tracks found'
  const positions = tracklist.map((track) => track.position).filter(Boolean)
  const count = `${tracklist.length} track${tracklist.length === 1 ? '' : 's'}`
  if (positions.length === 0) return count
  const first = positions[0]
  const last = positions[positions.length - 1]
  const range = first === last ? first : `${first}–${last}`
  return `${count} · ${range}`
}

function buildDiscsPatchValue(tracklist: DiscogsTrack[]) {
  return [
    {
      _key: crypto.randomUUID(),
      discNumber: 1,
      tracks: tracklist.map((track, index) => ({
        _key: crypto.randomUUID(),
        position: track.position || String(index + 1),
        title: track.title,
      })),
    },
  ]
}

function replaceCountWarning(count: number, noun: string): string {
  const plural = count === 1 ? noun : `${noun}s`
  return `Replaces ${count} existing ${plural}.`
}

function tracklistReplaceWarning(
  tracklistIsNew: boolean,
  existingTrackCount: number,
): string | undefined {
  if (!tracklistIsNew || existingTrackCount === 0) return undefined
  return replaceCountWarning(existingTrackCount, 'track')
}

function descriptionsReplaceWarning(
  descriptionsIsNew: boolean,
  existingCount: number | undefined,
): string | undefined {
  if (!descriptionsIsNew || !existingCount) return undefined
  return replaceCountWarning(existingCount, 'description')
}

/** Order-insensitive equality for the multi-value `descriptions` list. */
function sameDescriptions(incoming: string[] | undefined, existing: string[] | undefined): boolean {
  const a = incoming ?? []
  const b = existing ?? []
  if (a.length !== b.length) return false
  const existingSet = new Set(b)
  return a.every((value) => existingSet.has(value))
}

function mappedSummary(
  value: string | undefined,
  labelMap?: Record<string, string>,
): string | undefined {
  if (!value) return undefined
  return labelMap?.[value] ?? value
}

function tracklistField(
  tracklist: DiscogsTrack[],
  existingDiscs: ExistingDisc[] | undefined,
): DiscogsImportField {
  const hasTracks = tracklist.length > 0
  const isNew = hasTracks && !tracklistMatchesSingleDisc(existingDiscs, tracklist)
  return {
    key: 'discs',
    label: 'Tracklist',
    summary: buildTracklistSummary(tracklist),
    isNew,
    warning: tracklistReplaceWarning(isNew, countExistingTracks(existingDiscs)),
    value: buildDiscsPatchValue(tracklist),
  }
}

/** Scalar field that is only offered when it differs from the existing value. */
function diffScalarField(
  key: DiscogsImportFieldKey,
  label: string,
  incoming: string | undefined,
  existing: string | undefined,
  labelMap?: Record<string, string>,
): DiscogsImportField {
  const isNew = !!incoming && incoming !== existing
  return {
    key,
    label,
    summary: mappedSummary(incoming, labelMap),
    isNew,
    warning: isNew && existing ? REPLACE_VALUE_WARNING : undefined,
    value: incoming,
  }
}

function descriptionsField(
  incoming: string[] | undefined,
  existing: string[] | undefined,
): DiscogsImportField {
  const isNew = !!incoming?.length && !sameDescriptions(incoming, existing)
  return {
    key: 'descriptions',
    label: 'Descriptions',
    summary: incoming?.length
      ? incoming.map((v) => DESCRIPTION_LABEL[v] ?? v).join(', ')
      : undefined,
    isNew,
    warning: descriptionsReplaceWarning(isNew, existing?.length),
    value: incoming,
  }
}

export interface BuildDiscogsImportFieldsArgs {
  tracklist: DiscogsTrack[]
  formatPatch: DiscogsReleasePatch | null
  existing: ExistingReleaseValues
}

/**
 * Builds the ordered list of importable fields from the fetched Discogs data,
 * deriving each field's summary, overwrite warning, and whether it differs from
 * the document's current value.
 */
export function buildDiscogsImportFields({
  tracklist,
  formatPatch,
  existing,
}: BuildDiscogsImportFieldsArgs): DiscogsImportField[] {
  return [
    tracklistField(tracklist, existing.discs),
    diffScalarField(
      'mediaType',
      'Media type',
      formatPatch?.mediaType,
      existing.mediaType,
      MEDIA_TYPE_LABEL,
    ),
    diffScalarField(
      'classification',
      'Classification',
      formatPatch?.classification,
      existing.classification,
      CLASSIFICATION_LABEL,
    ),
    diffScalarField('speed', 'Speed', formatPatch?.speed, existing.speed, SPEED_LABEL),
    diffScalarField('size', 'Size', formatPatch?.size, existing.size),
    diffScalarField(
      'channels',
      'Channels',
      formatPatch?.channels,
      existing.channels,
      CHANNELS_LABEL,
    ),
    descriptionsField(formatPatch?.descriptions, existing.descriptions),
  ]
}
