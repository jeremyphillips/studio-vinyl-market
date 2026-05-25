import {defineEnableDraftMode} from 'next-sanity/draft-mode'

import {client} from '@/sanity/client'
import {readToken} from '@/sanity/env'

/**
 * Hit by Sanity's Presentation Tool: opens an iframe at this URL with a
 * one-shot `sanity-preview-secret` cookie that `defineEnableDraftMode`
 * exchanges for Next.js draft mode + a real `__prerender_bypass` cookie.
 *
 * Requires `SANITY_API_READ_TOKEN` so the helper can verify the secret against
 * the project's CORS origins.
 */
export const {GET} = defineEnableDraftMode({
  client: client.withConfig({token: readToken}),
})
