/**
 * Migrates release documents to the expanded format schema.
 *
 * Changes per document:
 *   - Sets classification = 'LP'
 *   - Sets mediaType    = 'vinyl'
 *   - Sets speed        = '33'
 *   - Sets size         = '12"'
 *   - Unsets the legacy `format` field
 *
 * Run from apps/studio:
 *   yarn migrate:release-format
 */
import { createClient } from '@sanity/client'

import { getSanityApiConfig } from '../sanity.project'

const { projectId, dataset } = getSanityApiConfig()

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

async function migrateReleaseFormat() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error(
      'Missing SANITY_API_WRITE_TOKEN. Create a token with Editor access in sanity.io/manage and add it to apps/studio/.env',
    )
  }

  const releases = await client.fetch<Array<{ _id: string }>>(`*[_type == "release"]{ _id }`)

  if (releases.length === 0) {
    console.log('No release documents found — nothing to migrate.')
    return
  }

  console.log(`Migrating ${releases.length} release(s)…`)

  const transaction = client.transaction()

  for (const { _id } of releases) {
    transaction.patch(_id, (patch) =>
      patch
        .set({
          classification: 'LP',
          mediaType: 'vinyl',
          speed: '33',
          size: '12"',
        })
        .unset(['format']),
    )
  }

  await transaction.commit()

  console.log(`Done. ${releases.length} release(s) migrated.`)
}

migrateReleaseFormat().catch((error) => {
  console.error(error)
  process.exit(1)
})
