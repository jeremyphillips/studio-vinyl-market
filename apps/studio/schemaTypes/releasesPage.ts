import {defineField, defineType} from 'sanity'

export const RELEASES_PAGE_ID = 'releasesPage'

export const releasesPage = defineType({
  name: 'releasesPage',
  title: 'Releases page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      description:
        'Heading (H1) on /releases. Navigation labels are set separately in Site settings.',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Releases',
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      description:
        'Optional text shown under the page title. The release count line is always shown below this.',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Releases page', subtitle: '/releases'}),
  },
})
