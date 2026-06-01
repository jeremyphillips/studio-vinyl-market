import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {CoverImage} from '@/components/catalog/cover-image/cover-image'
import {ReleaseCard} from '@/components/catalog/release-card/release-card.client'
import {H1, H2, Label} from '@/components/ui/typography'
import {client} from '@/sanity/client'
import {sanityFetch} from '@/sanity/live'
import {LABEL_QUERY, LABEL_SLUGS_QUERY} from '@/sanity/queries'

type Params = Promise<{slug: string}>

export async function generateStaticParams() {
  const slugs = await client
    .withConfig({useCdn: false, perspective: 'published', stega: false})
    .fetch(LABEL_SLUGS_QUERY)
  return slugs.map((slug) => ({slug}))
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const {slug} = await params
  const {data: label} = await sanityFetch({
    query: LABEL_QUERY,
    params: {slug},
    stega: false,
  })
  return label ? {title: label.name} : {}
}

export default async function LabelPage({params}: {params: Params}) {
  const {slug} = await params
  const {data: label} = await sanityFetch({
    query: LABEL_QUERY,
    params: {slug},
  })

  if (!label) notFound()

  const releases = label.releases ?? []

  return (
    <div className="space-y-10">
      <header className="grid gap-6 md:grid-cols-[180px_1fr] md:items-end">
        {label.cover && (
          <CoverImage
            source={label.cover}
            size={360}
            alt={`${label.name} logo`}
            className="md:size-44"
          />
        )}
        <div className="space-y-2">
          <Label>
            Label
          </Label>
          <H1>{label.name}</H1>
          <p className="text-muted-foreground">
            {releases.length} {releases.length === 1 ? 'release' : 'releases'}
          </p>
        </div>
      </header>

      <section aria-labelledby="releases-heading" className="space-y-4">
        <H2 id="releases-heading" size="h4">
          Releases
        </H2>
        {releases.length === 0 ? (
          <p className="text-muted-foreground">No releases yet.</p>
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
