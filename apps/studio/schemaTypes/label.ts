import { defineArrayMember, defineField, defineType } from 'sanity'

export const label = defineType({
  name: 'label',
  title: 'Label',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cover',
      title: 'Cover',
      description: 'Primary logo or artwork used in listings and previews.',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      description: 'Additional branding images or variants. Order matches display order.',
      type: 'array',
      of: [defineArrayMember({ type: 'imageWithAlt' })],
      options: { layout: 'grid' },
    }),
  ],
  orderings: [
    {
      title: 'Name (A–Z)',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', media: 'cover' },
  },
})
