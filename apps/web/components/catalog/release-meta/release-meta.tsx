import { stegaClean } from '@sanity/client/stega'
import {
  releaseChannelsOptions,
  releaseClassificationOptions,
  releaseDescriptionOptions,
  releaseMediaTypeOptions,
  releaseSizeOptions,
  releaseSpeedOptions,
} from '@vinyl-market/release-constants'
import Link from 'next/link'

import { formatYear } from '@/lib/date'
import { SLUG_PATH_BY_TYPE } from '@/lib/routes'

export const CLASSIFICATION_LABEL = Object.fromEntries(
  releaseClassificationOptions.map(({ value, title }) => [value, title]),
)
export const MEDIA_TYPE_LABEL = Object.fromEntries(
  releaseMediaTypeOptions.map(({ value, title }) => [value, title]),
)
export const SPEED_LABEL = Object.fromEntries(
  releaseSpeedOptions.map(({ value, title }) => [value, title]),
)
export const SIZE_LABEL = Object.fromEntries(
  releaseSizeOptions.map(({ value, title }) => [value, title]),
)
export const CHANNELS_LABEL = Object.fromEntries(
  releaseChannelsOptions.map(({ value, title }) => [value, title]),
)
export const DESCRIPTION_LABEL = Object.fromEntries(
  releaseDescriptionOptions.map(({ value, title }) => [value, title]),
)

export type ReleaseMetaProps = {
  mediaType: string | null
  classification: string | null
  size?: string | null
  speed?: string | null
  channels?: string | null
  descriptions?: string[] | null
  releaseYear?: number | null
  dateUnknown?: boolean | null
  label?: { name: string; slug: string } | null
  noLabel?: boolean | null
}

export function ReleaseMeta({
  mediaType,
  classification,
  size,
  speed,
  channels,
  descriptions,
  releaseYear,
  dateUnknown,
  label,
  noLabel,
}: ReleaseMetaProps) {
  const formatParts: string[] = [
    MEDIA_TYPE_LABEL[stegaClean(mediaType ?? '')] ?? mediaType,
    CLASSIFICATION_LABEL[stegaClean(classification ?? '')] ?? classification,
    size ? (SIZE_LABEL[stegaClean(size)] ?? size) : null,
    speed ? (SPEED_LABEL[stegaClean(speed)] ?? speed) : null,
    channels ? (CHANNELS_LABEL[stegaClean(channels)] ?? channels) : null,
  ].filter((p): p is string => Boolean(p))
  const formatLabel = formatParts.join(', ')

  const descriptionLabels =
    descriptions && descriptions.length > 0
      ? descriptions.map((d) => DESCRIPTION_LABEL[stegaClean(d)] ?? d).join(', ')
      : null

  const year = formatYear(releaseYear, dateUnknown)

  return (
    <dl className="grid grid-cols-2 gap-y-3 text-sm">
      <dt className="text-muted-foreground">Format</dt>
      <dd>{formatLabel}</dd>

      {descriptionLabels && (
        <>
          <dt className="text-muted-foreground">Descriptions</dt>
          <dd>{descriptionLabels}</dd>
        </>
      )}

      {year && (
        <>
          <dt className="text-muted-foreground">Year</dt>
          <dd>{year}</dd>
        </>
      )}

      <dt className="text-muted-foreground">Label</dt>
      <dd>
        {label ? (
          <Link
            href={`${SLUG_PATH_BY_TYPE.label}/${label.slug}` as const}
            className="underline-offset-4 hover:underline"
          >
            {label.name}
          </Link>
        ) : noLabel ? (
          'No label'
        ) : (
          '—'
        )}
      </dd>
    </dl>
  )
}
