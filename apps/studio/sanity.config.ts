import {defineConfig} from 'sanity'
import {defineLocations, presentationTool} from 'sanity/presentation'
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
      resolve: {
        locations: {
          release: defineLocations({
            select: {title: 'releaseName', slug: 'slug.current'},
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title ?? 'Untitled release',
                  href: `/releases/${doc?.slug}`,
                },
              ],
            }),
          }),
          artist: defineLocations({
            select: {title: 'name', slug: 'slug.current'},
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title ?? 'Untitled artist',
                  href: `/artists/${doc?.slug}`,
                },
              ],
            }),
          }),
          label: defineLocations({
            select: {title: 'name', slug: 'slug.current'},
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title ?? 'Untitled label',
                  href: `/labels/${doc?.slug}`,
                },
              ],
            }),
          }),
          page: defineLocations({
            select: {title: 'title', slug: 'slug.current'},
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title ?? 'Untitled page',
                  href: `/pages/${doc?.slug}`,
                },
              ],
            }),
          }),
          siteSettings: defineLocations({
            message: 'This document controls the site-wide header navigation.',
            tone: 'caution',
            resolve: () => ({
              locations: [{title: 'All pages (header)', href: '/'}],
            }),
          }),
          releasesPage: defineLocations({
            resolve: () => ({
              locations: [{title: 'Releases page', href: '/releases'}],
            }),
          }),
        },
      },
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
