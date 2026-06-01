import path from 'path'
import { fileURLToPath } from 'url'

import type { StorybookConfig } from '@storybook/nextjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Aliasing resolved absolute paths means these fire after tsconfig-paths runs,
// so the redirects take effect regardless of how the module is imported.
const sanityImageReal = path.resolve(__dirname, '../sanity/image')
const sanityImageMock = path.resolve(__dirname, '__mocks__/sanity-image.ts')

const nextSanityHooksReal = path.resolve(
  __dirname,
  '../../node_modules/next-sanity/dist/hooks/index.js',
)
const nextSanityHooksMock = path.resolve(__dirname, '__mocks__/next-sanity-hooks.ts')

// Yarn 1 hoists uuid to the root, leaving @sanity/uuid/node_modules/uuid as a phantom
// reference that Webpack tries to resolve but can't find. Alias it to the hoisted copy.
const sanityUuidNestedReal = path.resolve(
  __dirname,
  '../../node_modules/@sanity/uuid/node_modules/uuid',
)
const uuidHoisted = path.resolve(__dirname, '../../node_modules/uuid')

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  webpackFinal: async (webpackConfig) => {
    webpackConfig.resolve = webpackConfig.resolve ?? {}
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      [sanityImageReal]: sanityImageMock,
      [nextSanityHooksReal]: nextSanityHooksMock,
      [sanityUuidNestedReal]: uuidHoisted,
    }
    return webpackConfig
  },
}

export default config
