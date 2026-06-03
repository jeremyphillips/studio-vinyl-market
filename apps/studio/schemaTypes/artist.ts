import { defineArrayMember, defineField, defineType } from 'sanity'

export const artist = defineType({
  name: 'artist',
  title: 'Artist',
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
      description: 'Main photo used in listings and previews.',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      description: 'Additional images (live shots, logos, etc.). Order matches display order.',
      type: 'array',
      of: [defineArrayMember({ type: 'imageWithAlt' })],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'locations',
      title: 'Locations',
      description: 'One or more places associated with this artist.',
      type: 'array',
      of: [defineArrayMember({ type: 'artistLocation' })],
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
