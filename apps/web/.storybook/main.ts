import type {StorybookConfig} from '@storybook/nextjs'
import path from 'path'
import {fileURLToPath} from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Absolute path of the real sanity/image module (what tsconfig-paths resolves @/sanity/image to).
// Aliasing the absolute path means the redirect fires after tsconfig-paths runs.
const sanityImageReal = path.resolve(__dirname, '../sanity/image')
const sanityImageMock = path.resolve(__dirname, '__mocks__/sanity-image.ts')

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(ts|tsx)'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  webpackFinal: async (webpackConfig) => {
    webpackConfig.resolve = webpackConfig.resolve ?? {}
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      [sanityImageReal]: sanityImageMock,
    }
    return webpackConfig
  },
}

export default config
