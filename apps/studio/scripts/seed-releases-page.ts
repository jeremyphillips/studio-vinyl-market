/**
 * Idempotent seed for the releasesPage singleton.
 *
 * Run from apps/studio: yarn seed:releases-page
 */
import { createClient } from '@sanity/client'

import { RELEASES_PAGE_ID } from '../schemaTypes/releasesPage'
import { getSanityApiConfig } from '../sanity.project'

const { projectId, dataset } = getSanityApiConfig()

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

async function seedReleasesPage() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error(
      'Missing SANITY_API_WRITE_TOKEN. Create a token with Editor access in sanity.io/manage and add it to apps/studio/.env',
    )
  }

  await client.createOrReplace({
    _id: RELEASES_PAGE_ID,
    _type: 'releasesPage',
    title: 'Releases',
  })

  console.log(`Seeded ${RELEASES_PAGE_ID} in ${dataset}`)
}

seedReleasesPage().catch((error) => {
  console.error(error)
  process.exit(1)
})
