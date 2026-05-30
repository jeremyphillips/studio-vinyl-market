import {createContext, use} from 'react'
import Link from 'next/link'

import {Card, CardContent} from '@/components/ui/card'
import {CoverImage} from '@/components/catalog/cover-image/cover-image'
import {formatYear} from '@/catalog/format'
import type {ImageWithAltSource} from '@/sanity/image-types'
import type {ReleaseFormat} from '@/sanity/release-types'

type ReleaseData = {
  releaseName: string
  slug: string
  format: ReleaseFormat | string
  releaseDate?: string | null
  dateUnknown?: boolean | null
  artist?: {name: string; slug: string} | null
  cover?: ImageWithAltSource
}

type ReleaseCardContextValue = {
  release: ReleaseData
}

const ReleaseCardContext = createContext<ReleaseCardContextValue | null>(null)

function useReleaseCardContext(): ReleaseCardContextValue {
  const ctx = use(ReleaseCardContext)
  if (!ctx) {
    throw new Error('ReleaseCard sub-components must be used inside <ReleaseCard>')
  }
  return ctx
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ReleaseCardCover({
  priority,
  size = 400,
}: {
  priority?: boolean
  size?: number
}) {
  const {release} = useReleaseCardContext()
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

function ReleaseCardContent({children}: {children: React.ReactNode}) {
  return <CardContent className="space-y-1 px-4 py-4">{children}</CardContent>
}

function ReleaseCardTitle() {
  const {release} = useReleaseCardContext()
  return (
    <p className="line-clamp-2 font-medium leading-snug">{release.releaseName}</p>
  )
}

function ReleaseCardArtist() {
  const {release} = useReleaseCardContext()
  if (!release.artist) return null
  return (
    <p className="text-sm text-muted-foreground">{release.artist.name}</p>
  )
}

function ReleaseCardMeta() {
  const {release} = useReleaseCardContext()
  const year = formatYear(release.releaseDate, release.dateUnknown)
  return (
    <p className="text-xs text-muted-foreground">
      {[release.format, year].filter(Boolean).join(' · ')}
    </p>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

type ReleaseCardProps = {
  release: ReleaseData
  children: React.ReactNode
}

export function ReleaseCard({release, children}: ReleaseCardProps) {
  return (
    <ReleaseCardContext value={{release}}>
      <Card className="overflow-hidden py-0">
        <Link
          href={`/releases/${release.slug}` as const}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {children}
        </Link>
      </Card>
    </ReleaseCardContext>
  )
}

ReleaseCard.Cover = ReleaseCardCover
ReleaseCard.Content = ReleaseCardContent
ReleaseCard.Title = ReleaseCardTitle
ReleaseCard.Artist = ReleaseCardArtist
ReleaseCard.Meta = ReleaseCardMeta
