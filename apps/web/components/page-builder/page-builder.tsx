
import { ButtonBlock } from './button-block'
import { ImageBlock } from './image-block'

import type { PAGE_QUERY_RESULT } from '@/sanity/types'

type PageBuilderBlocks = NonNullable<NonNullable<PAGE_QUERY_RESULT>['pageBuilder']>

type PageBuilderProps = {
  blocks: PageBuilderBlocks | null | undefined
}

export function PageBuilder({ blocks }: PageBuilderProps) {
  if (!blocks?.length) return null

  return (
    <div className="space-y-8">
      {blocks.map((block) => {
        if (block._type === 'buttonBlock') {
          return (
            <div key={block._key}>
              <ButtonBlock
                label={block.label}
                variant={block.variant}
                size={block.size}
                linkType={block.linkType}
                externalUrl={block.externalUrl}
                internalLink={block.internalLink}
              />
            </div>
          )
        }

        if (block._type === 'imageWithAlt') {
          return (
            <ImageBlock
              key={block._key}
              asset={block.asset}
              hotspot={block.hotspot}
              crop={block.crop}
              alt={block.alt}
              caption={block.caption}
            />
          )
        }

        return null
      })}
    </div>
  )
}
