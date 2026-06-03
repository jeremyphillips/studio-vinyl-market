import { DownloadIcon, CheckmarkCircleIcon } from '@sanity/icons'
import { Button, Card, Checkbox, Flex, Stack, Text, useToast } from '@sanity/ui'
import { useCallback, useId, useMemo, useState } from 'react'
import { getPublishedId, useDocumentOperation, useFormValue } from 'sanity'
import { adaptDiscogsFormat } from '../../lib/discogs-adapter'
import { useDiscogsRelease } from '../hooks/useDiscogsRelease'
import { ErrorBanner } from '../ui'
import {
  buildDiscogsImportFields,
  type DiscogsImportField,
  type DiscogsImportFieldKey,
  type ExistingDisc,
} from './discogs-import-fields'

export interface DiscogsImportPanelProps {
  releaseId: number
}

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

interface DiscogsImportFieldsProps {
  baseId: string
  fields: DiscogsImportField[]
  isChecked: (key: DiscogsImportFieldKey) => boolean
  onToggle: (key: DiscogsImportFieldKey, checked: boolean) => void
  loading: boolean
  selectedCount: number
  onCancel: () => void
  onImport: () => void
}

function DiscogsImportFields({
  baseId,
  fields,
  isChecked,
  onToggle,
  loading,
  selectedCount,
  onCancel,
  onImport,
}: DiscogsImportFieldsProps) {
  return (
    <>
      {fields.map((field) => (
        <FormatRow
          key={field.key}
          id={`${baseId}-${field.key}`}
          label={field.label}
          summary={field.summary}
          warning={field.warning}
          checked={isChecked(field.key)}
          disabled={!field.isNew}
          onChange={(checked) => onToggle(field.key, checked)}
        />
      ))}

      <Flex gap={2} justify="flex-end">
        <Button mode="bleed" text="Cancel" onClick={onCancel} disabled={loading} />
        <Button
          tone="primary"
          text="Import selected"
          onClick={onImport}
          disabled={selectedCount === 0}
        />
      </Flex>
    </>
  )
}

interface DiscogsImportPanelBodyProps {
  data: Awaited<ReturnType<typeof useDiscogsRelease>>['data']
  allUpToDate: boolean
  loading: boolean
  onFetch: () => void
  onReset: () => void
  fieldsProps: DiscogsImportFieldsProps
}

function DiscogsImportPanelBody({
  data,
  allUpToDate,
  loading,
  onFetch,
  onReset,
  fieldsProps,
}: DiscogsImportPanelBodyProps) {
  if (data === null) {
    return (
      <Flex>
        <Button
          icon={DownloadIcon}
          mode="ghost"
          text={loading ? 'Fetching…' : 'Fetch from Discogs'}
          onClick={onFetch}
          disabled={loading}
        />
      </Flex>
    )
  }

  if (allUpToDate) {
    return (
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
          <Button mode="bleed" text="Done" onClick={onReset} />
        </Flex>
      </>
    )
  }

  return <DiscogsImportFields {...fieldsProps} />
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

  const [unchecked, setUnchecked] = useState<Set<DiscogsImportFieldKey>>(new Set())

  const isChecked = useCallback((key: DiscogsImportFieldKey) => !unchecked.has(key), [unchecked])

  const toggle = useCallback((key: DiscogsImportFieldKey, checked: boolean) => {
    setUnchecked((prev) => {
      const next = new Set(prev)
      if (checked) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const tracklist = useMemo(() => data?.tracklist ?? [], [data])
  const formatPatch = useMemo(() => (data ? adaptDiscogsFormat(data) : null), [data])

  const fields = useMemo(
    () =>
      buildDiscogsImportFields({
        tracklist,
        formatPatch,
        existing: {
          discs: existingDiscs,
          mediaType: existingMediaType,
          classification: existingClassification,
          speed: existingSpeed,
          size: existingSize,
          channels: existingChannels,
          descriptions: existingDescriptions,
        },
      }),
    [
      tracklist,
      formatPatch,
      existingDiscs,
      existingMediaType,
      existingClassification,
      existingSpeed,
      existingSize,
      existingChannels,
      existingDescriptions,
    ],
  )

  const allUpToDate = data !== null && fields.every((field) => !field.isNew)

  const handleFetch = useCallback(() => {
    setUnchecked(new Set())
    fetch(releaseId)
  }, [fetch, releaseId])

  const fieldOps = useMemo(() => {
    const ops: Record<string, unknown> = {}
    for (const field of fields) {
      if (field.isNew && isChecked(field.key)) ops[field.key] = field.value
    }
    return ops
  }, [fields, isChecked])

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

        <DiscogsImportPanelBody
          data={data}
          allUpToDate={allUpToDate}
          loading={loading}
          onFetch={handleFetch}
          onReset={reset}
          fieldsProps={{
            baseId,
            fields,
            isChecked,
            onToggle: toggle,
            loading,
            selectedCount,
            onCancel: reset,
            onImport: handleImport,
          }}
        />
      </Stack>
    </Card>
  )
}
