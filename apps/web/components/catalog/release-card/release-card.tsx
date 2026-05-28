import Link from 'next/link'

import {Card, CardContent} from '@/components/ui/card'
import {CoverImage} from '@/components/catalog/cover-image/cover-image'
import {formatYear} from '@/lib/format'
import type {ImageWithAltSource} from '@/sanity/image-types'

type ReleaseCardProps = {
  release: {
    releaseName: string
    slug: string
    format: 'LP' | 'EP' | 'Single' | string
    releaseDate?: string | null
    dateUnknown?: boolean | null
    artist?: {name: string; slug: string} | null
    cover?: ImageWithAltSource
  }
  /** Optional: hide the artist line when already rendered on an artist page. */
  hideArtist?: boolean
  priority?: boolean
}

export function ReleaseCard({release, hideArtist, priority}: ReleaseCardProps) {
  const year = formatYear(release.releaseDate, release.dateUnknown)

  return (
    <Card className="overflow-hidden py-0">
      <Link
        href={`/releases/${release.slug}` as const}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <CoverImage
          source={release.cover}
          size={400}
          priority={priority}
          alt={`${release.releaseName} cover`}
          className="rounded-none"
        />
        <CardContent className="space-y-1 px-4 py-4">
          <p className="line-clamp-2 font-medium leading-snug">
            {release.releaseName}
          </p>
          {!hideArtist && release.artist && (
            <p className="text-sm text-muted-foreground">{release.artist.name}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {[release.format, year].filter(Boolean).join(' · ')}
          </p>
        </CardContent>
      </Link>
    </Card>
  )
}
