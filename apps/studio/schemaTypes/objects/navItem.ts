import { defineField, defineType } from 'sanity'

const LINK_TYPE_OPTIONS: { title: string; value: 'internal' | 'external' }[] = [
  {
    title: 'Internal (releases page, release, artist, label, or page)',
    value: 'internal',
  },
  { title: 'External (URL)', value: 'external' },
]

const LINKABLE_TYPES = [
  { type: 'release' },
  { type: 'artist' },
  { type: 'label' },
  { type: 'releasesPage' },
  { type: 'page' },
]

export const navItem = defineType({
  name: 'navItem',
  title: 'Navigation item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      description:
        'Text shown in the navigation. Required even for internal links so editors can override the document title.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'linkType',
      title: 'Link type',
      type: 'string',
      options: { list: LINK_TYPE_OPTIONS, layout: 'radio' },
      initialValue: 'internal',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'internalLink',
      title: 'Internal link',
      type: 'reference',
      to: LINKABLE_TYPES,
      hidden: ({ parent }) => parent?.linkType !== 'internal',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { linkType?: string } | undefined
          if (parent?.linkType !== 'internal') return true
          const ref = (value as { _ref?: unknown } | undefined)?._ref
          return typeof ref === 'string' && ref.length > 0 ? true : 'Select a document to link to'
        }),
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      hidden: ({ parent }) => parent?.linkType !== 'external',
      validation: (Rule) =>
        Rule.uri({ scheme: ['http', 'https'], allowRelative: false }).custom((value, context) => {
          const parent = context.parent as { linkType?: string } | undefined
          if (parent?.linkType !== 'external') return true
          return typeof value === 'string' && value.length > 0 ? true : 'External URL is required'
        }),
    }),
  ],
  preview: {
    select: {
      label: 'label',
      linkType: 'linkType',
      externalUrl: 'externalUrl',
      internalType: 'internalLink._type',
      internalTitle: 'internalLink.name',
      internalReleaseTitle: 'internalLink.releaseName',
      internalPageTitle: 'internalLink.title',
      releasesPageTitle: 'internalLink.title',
    },
    prepare({
      label,
      linkType,
      externalUrl,
      internalType,
      internalTitle,
      internalReleaseTitle,
      internalPageTitle,
      releasesPageTitle,
    }) {
      let target: string
      if (linkType === 'external') {
        target = externalUrl || 'external link'
      } else if (internalType === 'releasesPage') {
        target = `releases page: ${releasesPageTitle || 'Releases'}`
      } else {
        target = `${internalType ?? 'internal'}: ${internalReleaseTitle || internalTitle || internalPageTitle || 'unset'}`
      }
      const title = label?.trim() || 'Untitled nav item'
      const marker = linkType === 'external' ? ' ↗' : ''
      return { title: `${title}${marker}`, subtitle: target }
    },
  },
})
