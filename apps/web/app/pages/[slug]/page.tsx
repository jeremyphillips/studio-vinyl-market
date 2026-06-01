import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageBuilder } from '@/components/page-builder/page-builder'
import { H1 } from '@/components/ui/typography'
import { client } from '@/sanity/client'
import { sanityFetch } from '@/sanity/live'
import { PAGE_QUERY, PAGE_SLUGS_QUERY } from '@/sanity/queries'
import { toNextMetadata } from '@/sanity/seo'

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  const slugs = await client
    .withConfig({ useCdn: false, perspective: 'published', stega: false })
    .fetch(PAGE_SLUGS_QUERY)
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const { data: page } = await sanityFetch({
    query: PAGE_QUERY,
    params: { slug },
    stega: false,
  })

  if (!page) return {}

  return toNextMetadata(page.seo, { title: page.title ?? slug })
}

export default async function PageRoute({ params }: { params: Params }) {
  const { slug } = await params
  const { data: page } = await sanityFetch({
    query: PAGE_QUERY,
    params: { slug },
  })

  if (!page) notFound()

  return (
    <div className="space-y-8">
      <header>
        <H1>{page.title}</H1>
      </header>

      <PageBuilder blocks={page.pageBuilder} />
    </div>
  )
}
