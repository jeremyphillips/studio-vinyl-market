import Link from 'next/link'

import {ReleaseCard} from '@/components/ReleaseCard'
import {Button} from '@/components/ui/button'
import {sanityFetch} from '@/sanity/live'
import {HOME_RELEASES_QUERY} from '@/sanity/queries'

export default async function HomePage() {
  const {data: releases} = await sanityFetch({query: HOME_RELEASES_QUERY})

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Latest releases
        </h1>
        <p className="text-muted-foreground">
          The most recently dated records in the catalogue.
        </p>
      </header>

      {releases.length === 0 ? (
        <p className="text-muted-foreground">No releases published yet.</p>
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
