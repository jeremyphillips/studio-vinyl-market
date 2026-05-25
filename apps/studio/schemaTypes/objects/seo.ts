import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      description:
        'Short page title for the browser tab and search results. Site name ("· Vinyl Market") is added automatically — do not include it here.',
      type: 'string',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (Rule) =>
        Rule.max(160).warning('Keep under ~160 characters for search snippets'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
