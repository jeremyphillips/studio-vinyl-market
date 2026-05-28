import type {
  SanityImageAssetReference,
  SanityImageCrop,
  SanityImageHotspot,
} from './types'

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
