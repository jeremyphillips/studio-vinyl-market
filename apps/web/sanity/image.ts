import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

import { dataset, projectId } from './env'
import type {
  SanityImageAssetReference,
  SanityImageCrop,
  SanityImageHotspot,
} from './types.generated'

const builder = createImageUrlBuilder({ projectId, dataset })

/**
 * Build a URL for a Sanity image source, automatically respecting hotspot/crop
 * data set on `imageWithAlt`.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format').fit('max')
}

/** GROQ projection: `{asset, hotspot, crop, alt}` from `imageWithAlt` fields. */
export type ImageWithAltSource =
  | {
      asset?: SanityImageAssetReference | null
      hotspot?: SanityImageHotspot | null
      crop?: SanityImageCrop | null
      alt?: string | null
    }
  | null
  | undefined
