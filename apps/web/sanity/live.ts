import {defineLive} from 'next-sanity/live'

import {client} from './client'
import {readToken} from './env'

/**
 * Live Content API hookup. `sanityFetch` is the only fetch helper we use from
 * React Server Components — it automatically:
 *
 *  - uses the published perspective by default
 *  - switches to drafts + stega when Next.js draft mode is enabled
 *  - registers cache tags so `<SanityLive />` can invalidate them in real time
 *
 * The viewer token is server-only (`serverToken`) so the browser never gets it.
 * We don't pass a `browserToken` because Presentation Tool runs the live
 * preview through its iframe + draft mode, not directly in the public bundle.
 */
export const {sanityFetch, SanityLive} = defineLive({
  client,
  serverToken: readToken,
  browserToken: undefined,
})
