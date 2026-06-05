import { client } from './client'

/**
 * Fetches all published slugs for a given GROQ query and returns them in the
 * shape Next.js `generateStaticParams` expects (`{ slug: string }[]`).
 *
 * CDN is bypassed and stega disabled so static generation always reads from
 * the primary dataset without Visual Editing annotations.
 */
export async function fetchStaticSlugs(query: string): Promise<{ slug: string }[]> {
  const slugs: string[] = await client
    .withConfig({ useCdn: false, perspective: 'published', stega: false })
    .fetch(query)
  return slugs.map((slug) => ({ slug }))
}
