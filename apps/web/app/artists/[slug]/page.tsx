import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Identity } from '@/components/catalog/identity/identity'
import { ReleaseCard } from '@/components/catalog/release-card/release-card.client'
import { H2, P } from '@/components/ui/typography'
import { client } from '@/sanity/client'
import { sanityFetch } from '@/sanity/live'
import { ARTIST_QUERY, ARTIST_SLUGS_QUERY } from '@/sanity/queries'

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  const slugs = await client
    .withConfig({ useCdn: false, perspective: 'published', stega: false })
    .fetch(ARTIST_SLUGS_QUERY)
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const { data: artist } = await sanityFetch({
    query: ARTIST_QUERY,
    params: { slug },
    stega: false,
  })
  return artist ? { title: artist.name } : {}
}

export default async function ArtistPage({ params }: { params: Params }) {
  const { slug } = await params
  const { data: artist } = await sanityFetch({
    query: ARTIST_QUERY,
    params: { slug },
  })

  if (!artist) notFound()

  const releases = artist.releases ?? []

  return (
    <div className="space-y-10">
      <Identity
        eyebrow="Artist"
        name={artist.name}
        cover={artist.cover}
        coverAlt={`${artist.name} photo`}
        releaseCount={releases.length}
        locations={artist.locations}
      />

      <section aria-labelledby="releases-heading" className="space-y-4">
        <H2 id="releases-heading" size="h4">
          Releases
        </H2>
        {releases.length === 0 ? (
          <P color="muted">No releases yet.</P>
        ) : (
          <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {releases.map((release) => (
              <li key={release._id}>
                <ReleaseCard release={release} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
