import { DownloadIcon } from '@sanity/icons'
import { Button, Card, Checkbox, Flex, Stack, Text, useToast } from '@sanity/ui'
import { useCallback, useId, useMemo, useState } from 'react'
import { getPublishedId, useDocumentOperation, useFormValue } from 'sanity'
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

export function DiscogsImportPanel({ releaseId }: DiscogsImportPanelProps) {
  const toast = useToast()
  const tracklistCheckboxId = useId()

  const documentId = getPublishedId((useFormValue(['_id']) as string | undefined) ?? '')
  const documentType = useFormValue(['_type']) as string
  const existingDiscs = useFormValue(['discs']) as ExistingDisc[] | undefined
  const { patch } = useDocumentOperation(documentId, documentType)

  const { data, loading, error, fetch, reset } = useDiscogsRelease()
  const [tracklistChecked, setTracklistChecked] = useState(true)

  const tracklist = useMemo(() => data?.tracklist ?? [], [data])
  const existingTrackCount = countExistingTracks(existingDiscs)
  const hasTracks = tracklist.length > 0
  const selectedCount = tracklistChecked && hasTracks ? 1 : 0

  const handleFetch = useCallback(() => {
    setTracklistChecked(true)
    fetch(releaseId)
  }, [fetch, releaseId])

  const handleImport = useCallback(() => {
    if (selectedCount === 0) return
    patch.execute([{ set: { discs: buildDiscsPatchValue(tracklist) } }])
    toast.push({
      status: 'success',
      title: 'Tracklist imported from Discogs',
      description: `${tracklist.length} track${tracklist.length === 1 ? '' : 's'} written.`,
    })
    reset()
  }, [patch, reset, selectedCount, toast, tracklist])

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
        ) : (
          <>
            <Flex align="flex-start" gap={3}>
              <Checkbox
                id={tracklistCheckboxId}
                checked={tracklistChecked}
                disabled={!hasTracks}
                onChange={(event) => setTracklistChecked(event.currentTarget.checked)}
                style={{ marginTop: 3 }}
              />
              <Stack flex={1} space={2}>
                <Text as="label" htmlFor={tracklistCheckboxId} size={1} weight="medium">
                  Tracklist
                </Text>
                <Text size={1} muted>
                  {buildTracklistSummary(tracklist)}
                </Text>
                {hasTracks && existingTrackCount > 0 && (
                  <Card tone="caution" padding={2} radius={2} border>
                    <Text size={1}>
                      Replaces {existingTrackCount} existing track
                      {existingTrackCount === 1 ? '' : 's'}.
                    </Text>
                  </Card>
                )}
              </Stack>
            </Flex>

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
