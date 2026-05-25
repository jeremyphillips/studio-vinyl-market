import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url'

import {dataset, projectId} from './env'

const builder = createImageUrlBuilder({projectId, dataset})

/**
 * Build a URL for a Sanity image source, automatically respecting hotspot/crop
 * data set on `imageWithAlt`.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format').fit('max')
}
