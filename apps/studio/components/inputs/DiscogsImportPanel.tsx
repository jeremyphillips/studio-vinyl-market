import { DownloadIcon, CheckmarkCircleIcon } from '@sanity/icons'
import { Button, Card, Checkbox, Flex, Stack, Text, useToast } from '@sanity/ui'
import { useCallback, useId, useMemo, useState } from 'react'
import {
  releaseChannelsOptions,
  releaseClassificationOptions,
  releaseDescriptionOptions,
  releaseMediaTypeOptions,
  releaseSpeedOptions,
} from '@vinyl-market/release-constants'
import { getPublishedId, useDocumentOperation, useFormValue } from 'sanity'
import { adaptDiscogsFormat } from '../../lib/discogs-adapter'
import { useDiscogsRelease } from '../hooks/useDiscogsRelease'
import type { DiscogsTrack } from '../types/discogs'
import { ErrorBanner } from '../ui'

export interface DiscogsImportPanelProps {
  releaseId: number
}

interface ExistingDisc {
  tracks?: unknown[]
}

function countExistingTracks(discs: ExistingDisc[] | undefined): number {
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
function tracklistMatchesSingleDisc(
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

const MEDIA_TYPE_LABEL = Object.fromEntries(releaseMediaTypeOptions.map((o) => [o.value, o.title]))
const CLASSIFICATION_LABEL = Object.fromEntries(
  releaseClassificationOptions.map((o) => [o.value, o.title]),
)
const SPEED_LABEL = Object.fromEntries(releaseSpeedOptions.map((o) => [o.value, o.title]))
const CHANNELS_LABEL = Object.fromEntries(releaseChannelsOptions.map((o) => [o.value, o.title]))
const DESCRIPTION_LABEL = Object.fromEntries(
  releaseDescriptionOptions.map((o) => [o.value, o.title]),
)

interface FormatRowProps {
  id: string
  label: string
  summary?: string
  checked: boolean
  disabled: boolean
  onChange: (checked: boolean) => void
  warning?: string
}

function FormatRow({ id, label, summary, checked, disabled, onChange, warning }: FormatRowProps) {
  return (
    <Flex align="center" gap={3}>
      <Checkbox
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.currentTarget.checked)}
      />
      <Stack flex={1} space={2}>
        <Text as="label" htmlFor={id} size={1} weight="medium">
          {label}
        </Text>
        {summary && (
          <Text size={1} muted>
            {summary}
          </Text>
        )}
        {warning && (
          <Card tone="caution" padding={2} radius={2} border>
            <Text size={1}>{warning}</Text>
          </Card>
        )}
      </Stack>
    </Flex>
  )
}

export function DiscogsImportPanel({ releaseId }: DiscogsImportPanelProps) {
  const toast = useToast()
  const baseId = useId()

  const documentId = getPublishedId((useFormValue(['_id']) as string | undefined) ?? '')
  const documentType = useFormValue(['_type']) as string
  const existingDiscs = useFormValue(['discs']) as ExistingDisc[] | undefined
  const existingMediaType = useFormValue(['mediaType']) as string | undefined
  const existingClassification = useFormValue(['classification']) as string | undefined
  const existingSpeed = useFormValue(['speed']) as string | undefined
  const existingSize = useFormValue(['size']) as string | undefined
  const existingChannels = useFormValue(['channels']) as string | undefined
  const existingDescriptions = useFormValue(['descriptions']) as string[] | undefined

  const { patch } = useDocumentOperation(documentId, documentType)
  const { data, loading, error, fetch, reset } = useDiscogsRelease()

  const [tracklistChecked, setTracklistChecked] = useState(true)
  const [mediaTypeChecked, setMediaTypeChecked] = useState(true)
  const [classificationChecked, setClassificationChecked] = useState(true)
  const [speedChecked, setSpeedChecked] = useState(true)
  const [sizeChecked, setSizeChecked] = useState(true)
  const [channelsChecked, setChannelsChecked] = useState(true)
  const [descriptionsChecked, setDescriptionsChecked] = useState(true)

  const tracklist = useMemo(() => data?.tracklist ?? [], [data])
  const formatPatch = useMemo(() => (data ? adaptDiscogsFormat(data) : null), [data])

  const existingTrackCount = countExistingTracks(existingDiscs)
  const hasTracks = tracklist.length > 0

  // A field is "new" when there is data to import AND it differs from what the
  // document already has. Disabled checkboxes are also excluded from fieldOps.
  const tracklistIsNew = hasTracks && !tracklistMatchesSingleDisc(existingDiscs, tracklist)
  const mediaTypeIsNew = !!formatPatch?.mediaType && formatPatch.mediaType !== existingMediaType
  const classificationIsNew =
    !!formatPatch?.classification && formatPatch.classification !== existingClassification
  const channelsIsNew = !!formatPatch?.channels && formatPatch.channels !== existingChannels

  const allUpToDate =
    data !== null &&
    !tracklistIsNew &&
    !mediaTypeIsNew &&
    !classificationIsNew &&
    !channelsIsNew &&
    !formatPatch?.speed &&
    !formatPatch?.size &&
    !formatPatch?.descriptions?.length

  const handleFetch = useCallback(() => {
    setTracklistChecked(true)
    setMediaTypeChecked(true)
    setClassificationChecked(true)
    setSpeedChecked(true)
    setSizeChecked(true)
    setChannelsChecked(true)
    setDescriptionsChecked(true)
    fetch(releaseId)
  }, [fetch, releaseId])

  const fieldOps = useMemo(() => {
    const ops: Record<string, unknown> = {}
    if (tracklistChecked && tracklistIsNew) ops.discs = buildDiscsPatchValue(tracklist)
    if (mediaTypeChecked && mediaTypeIsNew) ops.mediaType = formatPatch!.mediaType
    if (classificationChecked && classificationIsNew)
      ops.classification = formatPatch!.classification
    if (speedChecked && formatPatch?.speed) ops.speed = formatPatch.speed
    if (sizeChecked && formatPatch?.size) ops.size = formatPatch.size
    if (channelsChecked && channelsIsNew) ops.channels = formatPatch!.channels
    if (descriptionsChecked && formatPatch?.descriptions?.length)
      ops.descriptions = formatPatch.descriptions
    return ops
  }, [
    tracklistChecked,
    tracklistIsNew,
    tracklist,
    mediaTypeChecked,
    mediaTypeIsNew,
    classificationChecked,
    classificationIsNew,
    speedChecked,
    sizeChecked,
    channelsChecked,
    channelsIsNew,
    descriptionsChecked,
    formatPatch,
  ])

  const selectedCount = Object.keys(fieldOps).length

  const handleImport = useCallback(() => {
    if (selectedCount === 0) return
    patch.execute([{ set: fieldOps }])
    const fieldNames = Object.keys(fieldOps)
      .map((k) => (k === 'discs' ? 'tracklist' : k))
      .join(', ')
    toast.push({
      status: 'success',
      title: 'Imported from Discogs',
      description: `Wrote: ${fieldNames}.`,
    })
    reset()
  }, [patch, fieldOps, reset, selectedCount, toast])

  return (
    <Card padding={3} radius={2} border>
      <Stack space={3}>
        <Text size={1} weight="semibold">
          Import from Discogs
        </Text>

        {error && <ErrorBanner message={error} />}

        {data === null ? (
          <Flex>
            <Button
              icon={DownloadIcon}
              mode="ghost"
              text={loading ? 'Fetching…' : 'Fetch from Discogs'}
              onClick={handleFetch}
              disabled={loading}
            />
          </Flex>
        ) : allUpToDate ? (
          <>
            <Card tone="positive" padding={2} radius={2} border>
              <Flex align="center" gap={2}>
                <Text size={1}>
                  <CheckmarkCircleIcon />
                </Text>
                <Text size={1}>All fields are already up to date.</Text>
              </Flex>
            </Card>
            <Flex justify="flex-end">
              <Button mode="bleed" text="Done" onClick={reset} />
            </Flex>
          </>
        ) : (
          <>
            <FormatRow
              id={`${baseId}-tracklist`}
              label="Tracklist"
              summary={buildTracklistSummary(tracklist)}
              checked={tracklistChecked}
              disabled={!tracklistIsNew}
              onChange={setTracklistChecked}
              warning={
                tracklistIsNew && existingTrackCount > 0
                  ? `Replaces ${existingTrackCount} existing track${existingTrackCount === 1 ? '' : 's'}.`
                  : undefined
              }
            />

            <FormatRow
              id={`${baseId}-mediaType`}
              label="Media type"
              summary={
                formatPatch?.mediaType
                  ? (MEDIA_TYPE_LABEL[formatPatch.mediaType] ?? formatPatch.mediaType)
                  : undefined
              }
              checked={mediaTypeChecked}
              disabled={!mediaTypeIsNew}
              onChange={setMediaTypeChecked}
              warning={mediaTypeIsNew && existingMediaType ? 'Replaces current value.' : undefined}
            />

            <FormatRow
              id={`${baseId}-classification`}
              label="Classification"
              summary={
                formatPatch?.classification
                  ? (CLASSIFICATION_LABEL[formatPatch.classification] ?? formatPatch.classification)
                  : undefined
              }
              checked={classificationChecked}
              disabled={!classificationIsNew}
              onChange={setClassificationChecked}
              warning={
                classificationIsNew && existingClassification
                  ? 'Replaces current value.'
                  : undefined
              }
            />

            <FormatRow
              id={`${baseId}-speed`}
              label="Speed"
              summary={
                formatPatch?.speed
                  ? (SPEED_LABEL[formatPatch.speed] ?? formatPatch.speed)
                  : undefined
              }
              checked={speedChecked}
              disabled={!formatPatch?.speed}
              onChange={setSpeedChecked}
              warning={formatPatch?.speed && existingSpeed ? 'Replaces current value.' : undefined}
            />

            <FormatRow
              id={`${baseId}-size`}
              label="Size"
              summary={formatPatch?.size}
              checked={sizeChecked}
              disabled={!formatPatch?.size}
              onChange={setSizeChecked}
              warning={formatPatch?.size && existingSize ? 'Replaces current value.' : undefined}
            />

            <FormatRow
              id={`${baseId}-channels`}
              label="Channels"
              summary={
                formatPatch?.channels
                  ? (CHANNELS_LABEL[formatPatch.channels] ?? formatPatch.channels)
                  : undefined
              }
              checked={channelsChecked}
              disabled={!channelsIsNew}
              onChange={setChannelsChecked}
              warning={channelsIsNew && existingChannels ? 'Replaces current value.' : undefined}
            />

            <FormatRow
              id={`${baseId}-descriptions`}
              label="Descriptions"
              summary={
                formatPatch?.descriptions?.length
                  ? formatPatch.descriptions.map((v) => DESCRIPTION_LABEL[v] ?? v).join(', ')
                  : undefined
              }
              checked={descriptionsChecked}
              disabled={!formatPatch?.descriptions?.length}
              onChange={setDescriptionsChecked}
              warning={
                formatPatch?.descriptions?.length && existingDescriptions?.length
                  ? `Replaces ${existingDescriptions.length} existing description${existingDescriptions.length === 1 ? '' : 's'}.`
                  : undefined
              }
            />

            <Flex gap={2} justify="flex-end">
              <Button mode="bleed" text="Cancel" onClick={reset} disabled={loading} />
              <Button
                tone="primary"
                text="Import selected"
                onClick={handleImport}
                disabled={selectedCount === 0}
              />
            </Flex>
          </>
        )}
      </Stack>
    </Card>
  )
}
