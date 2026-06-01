import { defineArrayMember, defineField, defineType } from 'sanity'

export const SITE_SETTINGS_ID = 'siteSettings'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site title',
      description: 'Used as the brand label in the header and in <title> tags.',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Vinyl Market',
    }),
    defineField({
      name: 'navigation',
      title: 'Header navigation',
      description: 'Items shown in the site header, in order.',
      type: 'array',
      of: [defineArrayMember({ type: 'navItem' })],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site settings' }),
  },
})
