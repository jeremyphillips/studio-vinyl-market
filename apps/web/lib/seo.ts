import type {Metadata} from 'next'

import {urlFor} from '@/sanity/image'

type OgImageSource = {
  asset?: {_ref?: string} | null
  alt?: string | null
} | null | undefined

export type SeoFields = {
  metaTitle?: string | null
  metaDescription?: string | null
  noIndex?: boolean | null
  ogImage?: OgImageSource
} | null | undefined

/**
 * Maps CMS SEO fields to Next.js Metadata. Title is a short segment only;
 * root layout `title.template` appends "· Vinyl Market".
 */
export function toNextMetadata(
  seo: SeoFields,
  fallbacks: {title: string; description?: string},
): Metadata {
  const title = seo?.metaTitle?.trim() || fallbacks.title
  const description = seo?.metaDescription?.trim() || fallbacks.description

  const ogImage = seo?.ogImage
  const ogImageUrl =
    ogImage?.asset?._ref != null
      ? urlFor(ogImage).width(1200).height(630).url()
      : undefined

  return {
    title,
    ...(description ? {description} : {}),
    ...(seo?.noIndex ? {robots: {index: false, follow: true}} : {}),
    ...(ogImageUrl
      ? {
          openGraph: {
            images: [
              {
                url: ogImageUrl,
                ...(ogImage?.alt ? {alt: ogImage.alt} : {}),
              },
            ],
          },
        }
      : {}),
  }
}
