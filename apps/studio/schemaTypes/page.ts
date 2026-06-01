import React from 'react'
import { defineField, defineType } from 'sanity'

import { BlockPreview } from '../components/ui/BlockPreview'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'array',
      group: 'content',
      of: [
        { type: 'buttonBlock' },
        // `imageWithAlt` is a shared object used in many places (cover images,
        // gallery, SEO OG). To avoid showing the "Image" badge everywhere it
        // appears, the `components.preview` override is applied here at the
        // array-item level rather than on the registered `imageWithAlt` type.
        {
          type: 'imageWithAlt',
          components: {
            preview: (props) => React.createElement(BlockPreview, { ...props, blockName: 'Image' }),
          },
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare({ title, slug }) {
      return {
        title: title || 'Untitled page',
        subtitle: slug ? `/pages/${slug}` : 'No slug',
      }
    },
  },
})
