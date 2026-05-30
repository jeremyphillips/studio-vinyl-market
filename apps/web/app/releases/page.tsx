import type {Metadata} from 'next'

import {ReleaseCard} from '@/components/catalog/release-card/release-card'
import {toNextMetadata} from '@/sanity/seo'
import {sanityFetch} from '@/sanity/live'
import {RELEASES_PAGE_QUERY, RELEASES_QUERY} from '@/sanity/queries'

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
        <h1 className="text-3xl font-semibold tracking-tight">{heading}</h1>
        {intro ? (
          <p className="text-muted-foreground">{intro}</p>
        ) : null}
        <p className="text-muted-foreground">
          {releaseCountLabel(releases.length)}
        </p>
      </header>

      {releases.length === 0 ? (
        <p className="text-muted-foreground">No releases published yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {releases.map((release) => (
            <li key={release._id}>
              <ReleaseCard release={release}>
                <ReleaseCard.Cover />
                <ReleaseCard.Content>
                  <ReleaseCard.Title />
                  <ReleaseCard.Artist />
                  <ReleaseCard.Meta />
                </ReleaseCard.Content>
              </ReleaseCard>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
