'use client'

import Link from 'next/link'
import { createContext, use } from 'react'

import { formatYear } from '@/catalog/format'
import { CoverImage } from '@/components/catalog/cover-image/cover-image'
import { Card, CardContent } from '@/components/ui/card'
import { P, Small } from '@/components/ui/typography'
import type { ImageWithAltSource } from '@/sanity/image'
import type { ReleaseClassification } from '@/sanity/release.types'

export type ReleaseData = {
  releaseName: string
  slug: string
  classification: ReleaseClassification | string
  releaseDate?: string | null
  dateUnknown?: boolean | null
  artist?: { name: string; slug: string } | null
  cover?: ImageWithAltSource
}

type ReleaseCardContextValue = {
  release: ReleaseData
}

const ReleaseCardContext = createContext<ReleaseCardContextValue | null>(null)

function useReleaseCardContext(): ReleaseCardContextValue {
  const ctx = use(ReleaseCardContext)
  if (!ctx) throw new Error('ReleaseCard must be used inside ReleaseCardContext')
  return ctx
}

// ─── Private sub-components ───────────────────────────────────────────────────

function Cover({ priority, size = 400 }: { priority?: boolean; size?: number }) {
  const { release } = useReleaseCardContext()
  return (
    <CoverImage
      source={release.cover}
      size={size}
      priority={priority}
      alt={`${release.releaseName} cover`}
      className="rounded-none"
    />
  )
}

function Title() {
  const { release } = useReleaseCardContext()
  return (
    <P weight="medium" lines={2} className="leading-snug">
      {release.releaseName}
    </P>
  )
}

function Artist() {
  const { release } = useReleaseCardContext()
  if (!release.artist) return null
  return (
    <P size="body-sm" color="muted">
      {release.artist.name}
    </P>
  )
}

function Meta() {
  const { release } = useReleaseCardContext()
  const year = formatYear(release.releaseDate, release.dateUnknown)
  return <Small>{[release.classification, year].filter(Boolean).join(' · ')}</Small>
}

// ─── Public component ─────────────────────────────────────────────────────────

export type ReleaseCardProps = {
  release: ReleaseData
  /** Pass `true` for above-the-fold cards to hint the browser to prioritise the image. */
  priority?: boolean
}

export function ReleaseCard({ release, priority }: ReleaseCardProps) {
  return (
    <ReleaseCardContext value={{ release }}>
      <Card className="overflow-hidden py-0">
        <Link
          href={`/releases/${release.slug}` as const}
          className="focus-visible:ring-ring block focus-visible:ring-2 focus-visible:outline-none"
        >
          <Cover priority={priority} />
          <CardContent className="space-y-1 px-4 py-4">
            <Title />
            <Artist />
            <Meta />
          </CardContent>
        </Link>
      </Card>
    </ReleaseCardContext>
  )
}
