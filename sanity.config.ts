import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {getSanityApiConfig} from './sanity.project'
import {schemaTypes} from './schemaTypes'

const {projectId, dataset} = getSanityApiConfig()

export default defineConfig({
  name: 'default',
  title: 'Vinyl Market',

  projectId,
  dataset,

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
