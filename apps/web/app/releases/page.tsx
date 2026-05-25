import type {Metadata} from 'next'

import {ReleaseCard} from '@/components/ReleaseCard'
import {sanityFetch} from '@/sanity/live'
import {RELEASES_QUERY} from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Releases',
  description: 'Every release in the Vinyl Market catalogue.',
}

export default async function ReleasesPage() {
  const {data: releases} = await sanityFetch({query: RELEASES_QUERY})

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Releases</h1>
        <p className="text-muted-foreground">
          {releases.length} {releases.length === 1 ? 'release' : 'releases'} in
          the catalogue.
        </p>
      </header>

      {releases.length === 0 ? (
        <p className="text-muted-foreground">No releases published yet.</p>
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
