import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CoverImage } from '@/components/catalog/cover-image/cover-image'
import { DiscogsMeta } from '@/components/catalog/discogs-meta/discogs-meta'
import {
  CLASSIFICATION_LABEL,
  MEDIA_TYPE_LABEL,
  ReleaseMeta,
} from '@/components/catalog/release-meta/release-meta'
import { Tracklist } from '@/components/catalog/tracklist/tracklist'
import { H1, H2, P } from '@/components/ui/typography'
import { SLUG_PATH_BY_TYPE } from '@/lib/routes'
import { sanityFetch } from '@/sanity/live'
import { RELEASE_QUERY, RELEASE_SLUGS_QUERY } from '@/sanity/queries'
import { fetchStaticSlugs } from '@/sanity/static-params'

type Params = Promise<{ slug: string }>

export function generateStaticParams() {
  return fetchStaticSlugs(RELEASE_SLUGS_QUERY)
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const { data: release } = await sanityFetch({
    query: RELEASE_QUERY,
    params: { slug },
    stega: false,
  })
  if (!release) return {}
  const subtitle = [
    release.artist?.name,
    MEDIA_TYPE_LABEL[release.mediaType] ?? release.mediaType,
    CLASSIFICATION_LABEL[release.classification] ?? release.classification,
  ]
    .filter(Boolean)
    .join(' · ')
  return {
    title: release.releaseName,
    description: subtitle,
  }
}

export default async function ReleasePage({ params }: { params: Params }) {
  const { slug } = await params
  const { data: release } = await sanityFetch({
    query: RELEASE_QUERY,
    params: { slug },
  })

  if (!release) notFound()

  return (
    <article className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div>
        <CoverImage
          source={release.cover}
          size={720}
          priority
          alt={`${release.releaseName} cover`}
        />
      </div>

      <div className="space-y-6">
        <header className="space-y-2">
          <H1>{release.releaseName}</H1>
          {release.artist && (
            <P size="body-lg" color="muted">
              by{' '}
              <Link
                href={`${SLUG_PATH_BY_TYPE.artist}/${release.artist.slug}` as const}
                className="underline-offset-4 hover:underline"
              >
                {release.artist.name}
              </Link>
            </P>
          )}
        </header>

        <ReleaseMeta
          mediaType={release.mediaType}
          classification={release.classification}
          size={release.size}
          speed={release.speed}
          channels={release.channels}
          descriptions={release.descriptions}
          releaseYear={release.releaseYear}
          dateUnknown={release.dateUnknown}
          label={release.label}
          noLabel={release.noLabel}
        />

        <section aria-labelledby="tracklist-heading" className="space-y-3">
          <H2 id="tracklist-heading" size="h5">
            Tracklist
          </H2>
          <Tracklist discs={release.discs} />
        </section>

        <DiscogsMeta releaseId={release.discogs?.releaseId} masterId={release.discogs?.masterId} />
      </div>
    </article>
  )
}
