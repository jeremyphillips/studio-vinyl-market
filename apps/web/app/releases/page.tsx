import type {Metadata} from 'next'

import {ReleaseCard} from '@/components/catalog/release-card/release-card.client'
import {H1, P} from '@/components/ui/typography'
import {sanityFetch} from '@/sanity/live'
import {RELEASES_PAGE_QUERY, RELEASES_QUERY} from '@/sanity/queries'
import {toNextMetadata} from '@/sanity/seo'

const DEFAULT_TITLE = 'Releases'
const DEFAULT_DESCRIPTION =
  'Every release in the Vinyl Market catalogue.'

export async function generateMetadata(): Promise<Metadata> {
  const {data: page} = await sanityFetch({
    query: RELEASES_PAGE_QUERY,
    stega: false,
  })

  const title = page?.title?.trim() || DEFAULT_TITLE

  return toNextMetadata(page?.seo, {
    title,
    description: DEFAULT_DESCRIPTION,
  })
}

function releaseCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'release' : 'releases'} in the catalogue.`
}

export default async function ReleasesPage() {
  const [{data: page}, {data: releases}] = await Promise.all([
    sanityFetch({query: RELEASES_PAGE_QUERY}),
    sanityFetch({query: RELEASES_QUERY}),
  ])

  const heading = page?.title?.trim() || DEFAULT_TITLE
  const intro = page?.intro?.trim()

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <H1>{heading}</H1>
        {intro ? (
          <P color="muted">{intro}</P>
        ) : null}
        <P color="muted">
          {releaseCountLabel(releases.length)}
        </P>
      </header>

      {releases.length === 0 ? (
        <P color="muted">No releases published yet.</P>
      ) : (
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {releases.map((release) => (
            <li key={release._id}>
              <ReleaseCard release={release} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
