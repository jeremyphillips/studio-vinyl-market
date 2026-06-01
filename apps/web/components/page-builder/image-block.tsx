import Image from 'next/image'

import { buildImageSizes } from '@/lib/image'
import { urlFor } from '@/sanity/image'
import type { PAGE_QUERY_RESULT } from '@/sanity/types.generated'

type PageBuilderBlocks = NonNullable<NonNullable<PAGE_QUERY_RESULT>['pageBuilder']>
type ImageBlockData = Extract<PageBuilderBlocks[number], { _type: 'imageWithAlt' }>

type ImageBlockProps = Pick<ImageBlockData, 'asset' | 'hotspot' | 'crop' | 'alt' | 'caption'>

export function ImageBlock({ asset, hotspot, crop, alt, caption }: ImageBlockProps) {
  if (!asset?._ref) return null

  const url = urlFor({ asset, hotspot, crop }).width(1280).url()

  return (
    <figure className="space-y-2">
      <Image
        src={url}
        alt={alt ?? ''}
        width={1280}
        height={720}
        sizes={buildImageSizes('xl', 1280)}
        className="h-auto w-full rounded-md object-cover"
      />
      {caption ? (
        <figcaption className="text-muted-foreground text-sm">{caption}</figcaption>
      ) : null}
    </figure>
  )
}
