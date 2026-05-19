import {defineArrayMember, defineField, defineType} from 'sanity'

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
      name: 'cover',
      title: 'Cover',
      description: 'Primary logo or artwork used in listings and previews.',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      description:
        'Additional branding images or variants. Order matches display order.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
        }),
      ],
      options: {
        layout: 'grid',
      },
    }),
  ],
  preview: {
    select: {title: 'name', media: 'cover'},
  },
})
