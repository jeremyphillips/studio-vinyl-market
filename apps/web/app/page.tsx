import Link from 'next/link'

import { ReleaseGrid } from '@/components/catalog/release-grid'
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

      <ReleaseGrid
        releases={releases}
        emptyMessage="No releases published yet."
        priorityCount={4}
      />

      <div>
        <Button asChild variant="outline">
          <Link href="/releases">Browse all releases</Link>
        </Button>
      </div>
    </div>
  )
}
