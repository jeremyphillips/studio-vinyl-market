import type { Metadata } from 'next'

import { ReleaseGrid } from '@/components/catalog/release-grid'
import { H1, P } from '@/components/ui/typography'
import { sanityFetch } from '@/sanity/live'
import { toNextMetadata } from '@/sanity/metadata'
import { RELEASES_PAGE_QUERY, RELEASES_QUERY } from '@/sanity/queries'

const DEFAULT_TITLE = 'Releases'
const DEFAULT_DESCRIPTION = 'Every release in the Vinyl Market catalogue.'

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({
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
  const [{ data: page }, { data: releases }] = await Promise.all([
    sanityFetch({ query: RELEASES_PAGE_QUERY }),
    sanityFetch({ query: RELEASES_QUERY }),
  ])

  const heading = page?.title?.trim() || DEFAULT_TITLE
  const intro = page?.intro?.trim()

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <H1>{heading}</H1>
        {intro ? <P color="muted">{intro}</P> : null}
        <P color="muted">{releaseCountLabel(releases.length)}</P>
      </header>

      <ReleaseGrid releases={releases} emptyMessage="No releases published yet." />
    </div>
  )
}
