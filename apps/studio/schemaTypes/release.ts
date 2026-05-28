import {defineArrayMember, defineField, defineType} from 'sanity'
import {DiscogsSearchInput} from '../components/inputs/DiscogsSearchInput'
import {releaseFormatOptions, releaseSpeedOptions} from './constants/release'

function referenceHasRef(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const ref = (value as {_ref?: unknown})._ref
  return typeof ref === 'string' && ref.length > 0
}

const formatLabelByValue: Record<string, string> = Object.fromEntries(
  releaseFormatOptions.map((option) => [option.value, option.title]),
)

export const release = defineType({
  name: 'release',
  title: 'Release',
  type: 'document',
  groups: [
    {name: 'identity', title: 'Identity', default: true},
    {name: 'media', title: 'Media'},
    {name: 'tracklist', title: 'Tracklist'},
    {name: 'releaseInfo', title: 'Release info'},
    {name: 'discogs', title: 'Discogs'},
  ],
  fields: [
    defineField({
      name: 'artist',
      title: 'Artist',
      type: 'reference',
      to: [{type: 'artist'}],
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
      options: {source: 'releaseName', maxLength: 96},
      validation: (Rule) => Rule.required(),
      group: 'identity',
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      options: {
        list: releaseFormatOptions,
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      group: 'identity',
    }),
    defineField({
      name: 'speed',
      title: 'Speed',
      type: 'string',
      options: {
        list: releaseSpeedOptions,
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
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
      of: [defineArrayMember({type: 'imageWithAlt'})],
      options: {layout: 'grid'},
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
              description:
                'Optional label (e.g. “Bonus CD”, “DVD”, “Live set”).',
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
                    prepare({position, title}) {
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
            prepare({discNumber, name, tracks}) {
              const base =
                name?.trim() ||
                (typeof discNumber === 'number' ? `Disc ${discNumber}` : 'Disc')
              const count = Array.isArray(tracks) ? tracks.length : 0
              return {
                title: base,
                subtitle:
                  count === 0
                    ? 'No tracks yet'
                    : `${count} track${count === 1 ? '' : 's'}`,
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
      name: 'releaseDate',
      title: 'Release date',
      type: 'date',
      group: 'releaseInfo',
      hidden: ({parent}) => Boolean(parent?.dateUnknown),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {dateUnknown?: boolean} | undefined
          const dateUnknown = parent?.dateUnknown === true
          if (dateUnknown) return true
          if (!value) return 'Release date is required when the date is known'
          return true
        }),
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
      to: [{type: 'label'}],
      group: 'releaseInfo',
      hidden: ({parent}) => Boolean(parent?.noLabel),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {noLabel?: boolean} | undefined
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
      components: {input: DiscogsSearchInput},
    }),
  ],
  orderings: [
    {
      title: 'Release date (newest first)',
      name: 'releaseDateDesc',
      by: [{field: 'releaseDate', direction: 'desc'}],
    },
    {
      title: 'Artist (A–Z)',
      name: 'artistNameAsc',
      by: [{field: 'artist.name', direction: 'asc'}],
    },
    {
      title: 'Release name (A–Z)',
      name: 'releaseNameAsc',
      by: [{field: 'releaseName', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      releaseName: 'releaseName',
      artistName: 'artist.name',
      format: 'format',
      releaseDate: 'releaseDate',
      dateUnknown: 'dateUnknown',
      media: 'cover',
    },
    prepare({releaseName, artistName, format, releaseDate, dateUnknown, media}) {
      const title = releaseName || 'Untitled release'
      const formatLabel = format ? formatLabelByValue[format] ?? format : undefined
      const year = dateUnknown
        ? 'Year unknown'
        : typeof releaseDate === 'string' && releaseDate.length >= 4
          ? releaseDate.slice(0, 4)
          : undefined
      const subtitle = [artistName, formatLabel, year].filter(Boolean).join(' · ')
      return subtitle ? {title, subtitle, media} : {title, media}
    },
  },
})
