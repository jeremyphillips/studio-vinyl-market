import { PinIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'
import { LocationSearchInput } from '../../components/inputs/LocationSearchInput'

export const artistLocation = defineType({
  name: 'artistLocation',
  title: 'Location',
  type: 'object',
  icon: PinIcon,
  components: { input: LocationSearchInput },
  fields: [
    defineField({
      name: 'city',
      title: 'City / Town',
      type: 'string',
    }),
    defineField({
      name: 'state',
      title: 'State / Region',
      type: 'string',
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      description: 'Latitude / longitude used to place this location on a map.',
      type: 'geopoint',
    }),
    defineField({
      name: 'note',
      title: 'Note',
      description: 'Optional context, e.g. a former name or a place that no longer exists.',
      type: 'string',
    }),
  ],
  preview: {
    select: { city: 'city', state: 'state', country: 'country' },
    prepare({ city, state, country }) {
      const title = [city, state, country].filter(Boolean).join(', ')
      return { title: title || 'Untitled location' }
    },
  },
})
