import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Identity } from '@/components/catalog/identity/identity'
import { ReleaseGrid } from '@/components/catalog/release-grid'
import { H2 } from '@/components/ui/typography'
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
        <ReleaseGrid releases={releases} />
      </section>
    </div>
  )
}
