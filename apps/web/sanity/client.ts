import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, studioUrl } from './env'

/**
 * Public Sanity client used for all server-side reads. `useCdn` is `true`
 * because the Live Content API (configured in `live.ts`) revalidates the cache
 * when content changes.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: {
    studioUrl,
    // Stega is enabled lazily by `defineLive` only inside draft mode, so it
    // doesn't leak into normal published responses.
    enabled: false,
  },
})
