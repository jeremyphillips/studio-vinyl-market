import Link from 'next/link'

import { ReleaseCard } from '@/components/catalog/release-card/release-card.client'
import { Button } from '@/components/ui/button'
import { H1, P } from '@/components/ui/typography'
import { sanityFetch } from '@/sanity/live'
import { HOME_RELEASES_QUERY } from '@/sanity/queries'

export default async function HomePage() {
  const { data: releases } = await sanityFetch({ query: HOME_RELEASES_QUERY })

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <H1>Latest releases</H1>
        <P color="muted">The most recently dated records in the catalogue.</P>
      </header>

      {releases.length === 0 ? (
        <P color="muted">No releases published yet.</P>
      ) : (
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {releases.map((release, index) => (
            <li key={release._id}>
              <ReleaseCard release={release} priority={index < 4} />
            </li>
          ))}
        </ul>
      )}

      <div>
        <Button asChild variant="outline">
          <Link href="/releases">Browse all releases</Link>
        </Button>
      </div>
    </div>
  )
}
