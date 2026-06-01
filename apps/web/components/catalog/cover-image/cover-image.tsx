import Image from 'next/image'

import { buildImageSizes } from '@/lib/image'
import { cn } from '@/lib/utils'
import { urlFor } from '@/sanity/image'
import type { ImageWithAltSource } from '@/sanity/image'

type CoverImageProps = {
  source: ImageWithAltSource
  /** Rendered size (also used for `next/image` width/height). */
  size?: number
  className?: string
  /** Override alt text. Defaults to the alt set on the image in Sanity. */
  alt?: string
  priority?: boolean
}

export function CoverImage({
  source,
  size = 480,
  className,
  alt,
  priority = false,
}: CoverImageProps) {
  if (!source?.asset?._ref) {
    return (
      <div
        className={cn(
          'bg-muted text-muted-foreground flex aspect-square w-full items-center justify-center rounded-md border text-xs',
          className,
        )}
        role="img"
        aria-label="No cover image"
      >
        No cover
      </div>
    )
  }

  const url = urlFor(source).width(size).height(size).url()
  const altText = alt ?? source.alt ?? ''

  return (
    <Image
      src={url}
      alt={altText}
      width={size}
      height={size}
      sizes={buildImageSizes('md', size)}
      priority={priority}
      className={cn('h-auto w-full rounded-md object-cover', className)}
    />
  )
}
