import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Identity } from '@/components/catalog/identity/identity'
import { ReleaseCard } from '@/components/catalog/release-card/release-card.client'
import { H2, P } from '@/components/ui/typography'
import { client } from '@/sanity/client'
import { sanityFetch } from '@/sanity/live'
import { LABEL_QUERY, LABEL_SLUGS_QUERY } from '@/sanity/queries'

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  const slugs = await client
    .withConfig({ useCdn: false, perspective: 'published', stega: false })
    .fetch(LABEL_SLUGS_QUERY)
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const { data: label } = await sanityFetch({
    query: LABEL_QUERY,
    params: { slug },
    stega: false,
  })
  return label ? { title: label.name } : {}
}

export default async function LabelPage({ params }: { params: Params }) {
  const { slug } = await params
  const { data: label } = await sanityFetch({
    query: LABEL_QUERY,
    params: { slug },
  })

  if (!label) notFound()

  const releases = label.releases ?? []

  return (
    <div className="space-y-10">
      <Identity
        eyebrow="Label"
        name={label.name}
        cover={label.cover}
        coverAlt={`${label.name} logo`}
        releaseCount={releases.length}
        locations={label.locations}
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
