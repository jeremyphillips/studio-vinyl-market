import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'

import {CoverImage} from '@/components/catalog/cover-image/cover-image'
import {DiscogsMeta} from '@/components/preview/discogs-meta/discogs-meta'
import {Tracklist} from '@/components/catalog/tracklist/tracklist'
import {H1, H2, P} from '@/components/ui/typography'
import {formatYear} from '@/catalog/format'
import {SLUG_PATH_BY_TYPE} from '@/lib/routes'
import {client} from '@/sanity/client'
import {sanityFetch} from '@/sanity/live'
import {RELEASE_QUERY, RELEASE_SLUGS_QUERY} from '@/sanity/queries'

const FORMAT_LABEL: Record<string, string> = {
  LP: 'LP',
  EP: 'EP',
  Single: 'Single',
}

const SPEED_LABEL: Record<string, string> = {
  '33': '33 RPM',
  '45': '45 RPM',
  '78': '78 RPM',
}

type Params = Promise<{slug: string}>

export async function generateStaticParams() {
  const slugs = await client
    .withConfig({useCdn: false, perspective: 'published', stega: false})
    .fetch(RELEASE_SLUGS_QUERY)
  return slugs.map((slug) => ({slug}))
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const {slug} = await params
  const {data: release} = await sanityFetch({
    query: RELEASE_QUERY,
    params: {slug},
    stega: false,
  })
  if (!release) return {}
  const subtitle = [release.artist?.name, FORMAT_LABEL[release.format] ?? release.format]
    .filter(Boolean)
    .join(' · ')
  return {
    title: release.releaseName,
    description: subtitle,
  }
}

export default async function ReleasePage({params}: {params: Params}) {
  const {slug} = await params
  const {data: release} = await sanityFetch({
    query: RELEASE_QUERY,
    params: {slug},
  })

  if (!release) notFound()

  const year = formatYear(release.releaseDate, release.dateUnknown)
  const formatLabel = FORMAT_LABEL[release.format] ?? release.format
  const speedLabel = SPEED_LABEL[release.speed] ?? release.speed

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
          <H1>
            {release.releaseName}
          </H1>
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

        <dl className="grid grid-cols-2 gap-y-3 text-sm">
          <dt className="text-muted-foreground">Format</dt>
          <dd>{formatLabel}</dd>

          <dt className="text-muted-foreground">Speed</dt>
          <dd>{speedLabel}</dd>

          {year && (
            <>
              <dt className="text-muted-foreground">Year</dt>
              <dd>{year}</dd>
            </>
          )}

          <dt className="text-muted-foreground">Label</dt>
          <dd>
            {release.label ? (
              <Link
                href={`${SLUG_PATH_BY_TYPE.label}/${release.label.slug}` as const}
                className="underline-offset-4 hover:underline"
              >
                {release.label.name}
              </Link>
            ) : release.noLabel ? (
              'No label'
            ) : (
              '—'
            )}
          </dd>
        </dl>

        <section aria-labelledby="tracklist-heading" className="space-y-3">
          <H2 id="tracklist-heading" size="h5">
            Tracklist
          </H2>
          <Tracklist discs={release.discs} />
        </section>

        <DiscogsMeta
          releaseId={release.discogs?.releaseId}
          masterId={release.discogs?.masterId}
        />
      </div>
    </article>
  )
}
