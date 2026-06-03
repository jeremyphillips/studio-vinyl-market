import { defineArrayMember, defineField, defineType } from 'sanity'
import { DiscogsSearchInput } from '../components/inputs/DiscogsSearchInput'
import { ReleaseDocumentInput } from '../components/inputs/ReleaseDocumentInput'
import {
  releaseClassificationOptions,
  releaseChannelsOptions,
  releaseDescriptionOptions,
  releaseMediaTypeOptions,
  releaseSizeOptions,
  releaseSpeedOptions,
} from './constants/release'

function referenceHasRef(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const ref = (value as { _ref?: unknown })._ref
  return typeof ref === 'string' && ref.length > 0
}

/** mediaType values for which speed and size are applicable. */
const DISC_MEDIA_TYPES = ['vinyl', 'shellac']

function isDiscMedia(mediaType: unknown): boolean {
  return typeof mediaType === 'string' && DISC_MEDIA_TYPES.includes(mediaType)
}

const classificationLabelByValue: Record<string, string> = Object.fromEntries(
  releaseClassificationOptions.map((option) => [option.value, option.title]),
)

const mediaTypeLabelByValue: Record<string, string> = Object.fromEntries(
  releaseMediaTypeOptions.map((option) => [option.value, option.title]),
)

export const release = defineType({
  name: 'release',
  title: 'Release',
  type: 'document',
  components: { input: ReleaseDocumentInput },
  initialValue: {
    datePrecision: 'year',
  },
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'media', title: 'Media' },
    { name: 'tracklist', title: 'Tracklist' },
    { name: 'releaseInfo', title: 'Release info' },
    { name: 'discogs', title: 'Discogs' },
  ],
  fieldsets: [{ name: 'formatGroup', title: 'Format', options: { columns: 2 } }],
  fields: [
    defineField({
      name: 'artist',
      title: 'Artist',
      type: 'reference',
      to: [{ type: 'artist' }],
      validation: (Rule) => Rule.required(),
      group: 'identity',
    }),
    defineField({
      name: 'releaseName',
      title: 'Release name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'identity',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'releaseName', maxLength: 96 },
      validation: (Rule) => Rule.required(),
      group: 'identity',
    }),
    defineField({
      name: 'mediaType',
      title: 'Media type',
      type: 'string',
      options: {
        list: releaseMediaTypeOptions,
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'vinyl',
      validation: (Rule) => Rule.required(),
      group: 'identity',
      fieldset: 'formatGroup',
    }),
    defineField({
      name: 'classification',
      title: 'Classification',
      type: 'string',
      options: {
        list: releaseClassificationOptions,
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'LP',
      validation: (Rule) => Rule.required(),
      group: 'identity',
      fieldset: 'formatGroup',
    }),
    defineField({
      name: 'speed',
      title: 'Speed',
      type: 'string',
      options: {
        list: releaseSpeedOptions,
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: '33',
      group: 'identity',
      fieldset: 'formatGroup',
      hidden: ({ parent }) => !isDiscMedia(parent?.mediaType),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { mediaType?: string } | undefined
          if (isDiscMedia(parent?.mediaType) && !value) {
            return 'Speed is required for vinyl and shellac releases'
          }
          return true
        }),
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      options: {
        list: releaseSizeOptions,
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: '12"',
      group: 'identity',
      fieldset: 'formatGroup',
      hidden: ({ parent }) => !isDiscMedia(parent?.mediaType),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { mediaType?: string } | undefined
          if (isDiscMedia(parent?.mediaType) && !value) {
            return 'Size is required for vinyl and shellac releases'
          }
          return true
        }),
    }),
    defineField({
      name: 'channels',
      title: 'Channels',
      type: 'string',
      options: {
        list: releaseChannelsOptions,
        layout: 'radio',
        direction: 'horizontal',
      },
      group: 'identity',
      fieldset: 'formatGroup',
    }),
    defineField({
      name: 'descriptions',
      title: 'Descriptions',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        list: releaseDescriptionOptions,
      },
      group: 'identity',
    }),
    defineField({
      name: 'cover',
      title: 'Cover',
      description: 'Front cover used as the main listing image.',
      type: 'imageWithAlt',
      group: 'media',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      description:
        'Additional photos (back cover, labels, inserts, etc.). Order matches display order.',
      type: 'array',
      of: [defineArrayMember({ type: 'imageWithAlt' })],
      options: { layout: 'grid' },
      group: 'media',
    }),
    defineField({
      name: 'discs',
      title: 'Discs',
      description:
        'One row per disc or platter (single LP = one entry; double LP = two). Reorder discs to match packaging. Track order within each disc matches playback/credits order.',
      type: 'array',
      group: 'tracklist',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'discNumber',
              title: 'Disc number',
              type: 'number',
              description: 'Catalog sequence for this release (1, 2, 3…).',
              validation: (Rule) => Rule.required().integer().min(1),
              initialValue: 1,
            }),
            defineField({
              name: 'name',
              title: 'Disc name',
              type: 'string',
              description: 'Optional label (e.g. "Bonus CD", "DVD", "Live set").',
            }),
            defineField({
              name: 'tracks',
              title: 'Tracks',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'position',
                      title: 'Position',
                      type: 'string',
                      description:
                        'Medium-specific index: vinyl (e.g. A1, B2), CD/digital (e.g. 1, 01), etc.',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'title',
                      title: 'Track title',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                  preview: {
                    select: {
                      position: 'position',
                      title: 'title',
                    },
                    prepare({ position, title }) {
                      const pos = position?.trim()
                      const t = title?.trim() || 'Untitled track'
                      return {
                        title: pos ? `${pos} — ${t}` : t,
                      }
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              discNumber: 'discNumber',
              name: 'name',
              tracks: 'tracks',
            },
            prepare({ discNumber, name, tracks }) {
              const base =
                name?.trim() || (typeof discNumber === 'number' ? `Disc ${discNumber}` : 'Disc')
              const count = Array.isArray(tracks) ? tracks.length : 0
              let subtitle: string
              if (count === 0) {
                subtitle = 'No tracks yet'
              } else {
                const trackWord = count === 1 ? 'track' : 'tracks'
                subtitle = `${count} ${trackWord}`
              }
              return {
                title: base,
                subtitle,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'dateUnknown',
      title: 'Release date unknown',
      type: 'boolean',
      initialValue: false,
      group: 'releaseInfo',
    }),
    defineField({
      name: 'datePrecision',
      title: 'Precision',
      type: 'string',
      options: {
        list: [
          { title: 'Year', value: 'year' },
          { title: 'Month', value: 'month' },
          { title: 'Day', value: 'day' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      group: 'releaseInfo',
      hidden: ({ parent }) => Boolean(parent?.dateUnknown),
    }),
    defineField({
      name: 'releaseYear',
      title: 'Year',
      type: 'number',
      group: 'releaseInfo',
      hidden: ({ parent }) => Boolean(parent?.dateUnknown),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { dateUnknown?: boolean } | undefined
          if (parent?.dateUnknown) return true
          if (!value) return 'Year is required when the date is known'
          return true
        })
          .integer()
          .min(1860)
          .max(2099),
    }),
    defineField({
      name: 'releaseMonth',
      title: 'Month',
      type: 'string',
      options: {
        list: [
          { title: 'January', value: '01' },
          { title: 'February', value: '02' },
          { title: 'March', value: '03' },
          { title: 'April', value: '04' },
          { title: 'May', value: '05' },
          { title: 'June', value: '06' },
          { title: 'July', value: '07' },
          { title: 'August', value: '08' },
          { title: 'September', value: '09' },
          { title: 'October', value: '10' },
          { title: 'November', value: '11' },
          { title: 'December', value: '12' },
        ],
      },
      group: 'releaseInfo',
      hidden: ({ parent }) =>
        Boolean(parent?.dateUnknown) ||
        (parent?.datePrecision !== 'month' && parent?.datePrecision !== 'day'),
    }),
    defineField({
      name: 'releaseDay',
      title: 'Day',
      type: 'number',
      group: 'releaseInfo',
      hidden: ({ parent }) => Boolean(parent?.dateUnknown) || parent?.datePrecision !== 'day',
      validation: (Rule) => Rule.integer().min(1).max(31),
    }),
    defineField({
      name: 'noLabel',
      title: 'No label',
      type: 'boolean',
      initialValue: false,
      group: 'releaseInfo',
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'reference',
      to: [{ type: 'label' }],
      group: 'releaseInfo',
      hidden: ({ parent }) => Boolean(parent?.noLabel),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { noLabel?: boolean } | undefined
          const noLabel = parent?.noLabel === true
          if (noLabel) return true
          if (!referenceHasRef(value)) return 'Label is required when the release has a label'
          return true
        }),
    }),
    defineField({
      name: 'discogs',
      title: 'Discogs',
      type: 'object',
      group: 'discogs',
      fields: [
        defineField({
          name: 'releaseId',
          title: 'Release ID',
          type: 'number',
          readOnly: true,
        }),
        defineField({
          name: 'masterId',
          title: 'Master ID',
          type: 'number',
          readOnly: true,
        }),
      ],
      components: { input: DiscogsSearchInput },
    }),
  ],
  orderings: [
    {
      title: 'Release date (newest first)',
      name: 'releaseDateDesc',
      by: [{ field: 'releaseYear', direction: 'desc' }],
    },
    {
      title: 'Artist (A–Z)',
      name: 'artistNameAsc',
      by: [{ field: 'artist.name', direction: 'asc' }],
    },
    {
      title: 'Release name (A–Z)',
      name: 'releaseNameAsc',
      by: [{ field: 'releaseName', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      releaseName: 'releaseName',
      artistName: 'artist.name',
      classification: 'classification',
      mediaType: 'mediaType',
      releaseYear: 'releaseYear',
      dateUnknown: 'dateUnknown',
      media: 'cover',
    },
    prepare({
      releaseName,
      artistName,
      classification,
      mediaType,
      releaseYear,
      dateUnknown,
      media,
    }) {
      const title = releaseName || 'Untitled release'
      const classLabel = classification
        ? (classificationLabelByValue[classification] ?? classification)
        : undefined
      const mediaLabel = mediaType ? (mediaTypeLabelByValue[mediaType] ?? mediaType) : undefined
      let year: string | undefined
      if (dateUnknown) {
        year = 'Year unknown'
      } else if (typeof releaseYear === 'number') {
        year = String(releaseYear)
      }
      const subtitle = [artistName, mediaLabel, classLabel, year].filter(Boolean).join(' · ')
      return subtitle ? { title, subtitle, media } : { title, media }
    },
  },
})
