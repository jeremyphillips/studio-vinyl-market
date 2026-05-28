import React from 'react'
import {defineField, defineType} from 'sanity'

import {BlockPreview} from '../../components/ui/BlockPreview'

const LINK_TYPE_OPTIONS: {title: string; value: 'internal' | 'external'}[] = [
  {
    title: 'Internal (releases page, release, artist, or label)',
    value: 'internal',
  },
  {title: 'External (URL)', value: 'external'},
]

const LINKABLE_TYPES = [
  {type: 'release'},
  {type: 'artist'},
  {type: 'label'},
  {type: 'releasesPage'},
  {type: 'page'},
]

const VARIANT_OPTIONS = [
  {title: 'Default', value: 'default'},
  {title: 'Outline', value: 'outline'},
  {title: 'Secondary', value: 'secondary'},
  {title: 'Ghost', value: 'ghost'},
  {title: 'Link', value: 'link'},
  {title: 'Destructive', value: 'destructive'},
]

const SIZE_OPTIONS = [
  {title: 'Default', value: 'default'},
  {title: 'Small', value: 'sm'},
  {title: 'Large', value: 'lg'},
  {title: 'Icon', value: 'icon'},
]

export const buttonBlock = defineType({
  name: 'buttonBlock',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {list: VARIANT_OPTIONS, layout: 'select'},
      initialValue: 'default',
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      options: {list: SIZE_OPTIONS, layout: 'select'},
      initialValue: 'default',
    }),
    defineField({
      name: 'linkType',
      title: 'Link type',
      type: 'string',
      options: {list: LINK_TYPE_OPTIONS, layout: 'radio'},
      initialValue: 'internal',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'internalLink',
      title: 'Internal link',
      type: 'reference',
      to: LINKABLE_TYPES,
      hidden: ({parent}) => parent?.linkType !== 'internal',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {linkType?: string} | undefined
          if (parent?.linkType !== 'internal') return true
          const ref = (value as {_ref?: unknown} | undefined)?._ref
          return typeof ref === 'string' && ref.length > 0
            ? true
            : 'Select a document to link to'
        }),
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
      validation: (Rule) =>
        Rule.uri({scheme: ['http', 'https'], allowRelative: false}).custom(
          (value, context) => {
            const parent = context.parent as {linkType?: string} | undefined
            if (parent?.linkType !== 'external') return true
            return typeof value === 'string' && value.length > 0
              ? true
              : 'External URL is required'
          },
        ),
    }),
  ],
  preview: {
    select: {
      label: 'label',
      variant: 'variant',
      linkType: 'linkType',
      externalUrl: 'externalUrl',
      internalType: 'internalLink._type',
      internalTitle: 'internalLink.name',
      internalReleaseTitle: 'internalLink.releaseName',
      internalPageTitle: 'internalLink.title',
    },
    prepare({
      label,
      variant,
      linkType,
      externalUrl,
      internalType,
      internalTitle,
      internalReleaseTitle,
      internalPageTitle,
    }) {
      const target =
        linkType === 'external'
          ? externalUrl || 'external link'
          : `${internalType ?? 'internal'}: ${internalReleaseTitle || internalTitle || internalPageTitle || 'unset'}`
      return {
        title: label?.trim() || 'Untitled button',
        subtitle: `${variant ?? 'default'} · ${target}`,
      }
    },
  },
  components: {
    preview: (props) => React.createElement(BlockPreview, {...props, blockName: 'Button'}),
  },
})
