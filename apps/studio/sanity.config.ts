import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {getSanityApiConfig, getSanityPreviewUrl} from './sanity.project'
import {schemaTypes} from './schemaTypes'
import {SITE_SETTINGS_ID} from './schemaTypes/siteSettings'
import {structure} from './structure'

const {projectId, dataset} = getSanityApiConfig()
const previewUrl = getSanityPreviewUrl()

const SINGLETON_TYPES = new Set<string>(['siteSettings'])
const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',
  title: 'Vinyl Market',

  projectId,
  dataset,

  plugins: [
    structureTool({structure}),
    presentationTool({
      previewUrl: {
        origin: previewUrl,
        preview: '/',
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Hide singletons from the global "+ Create" menu so editors can't
    // make duplicates. The Structure tool exposes the one canonical doc.
    newDocumentOptions: (prev, {creationContext}) => {
      if (creationContext.type === 'global') {
        return prev.filter((option) => !SINGLETON_TYPES.has(option.templateId))
      }
      return prev
    },
    // Restrict actions on singleton documents: no duplicate / no delete /
    // no unpublish.
    actions: (input, {schemaType}) => {
      if (SINGLETON_TYPES.has(schemaType)) {
        return input.filter(
          ({action}) => action && SINGLETON_ACTIONS.has(action),
        )
      }
      return input
    },
  },
})

export {SITE_SETTINGS_ID}
