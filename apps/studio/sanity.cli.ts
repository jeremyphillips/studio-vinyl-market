import { config as loadEnv } from 'dotenv'
import { defineCliConfig } from 'sanity/cli'
import { getSanityApiConfig } from './sanity.project'

loadEnv()

const { projectId, dataset } = getSanityApiConfig()

/**
 * TypeGen — extracts the schema and scans the Next.js app for `defineQuery`
 * calls, writing inferred query result types alongside the queries in apps/web.
 *
 * Run with `yarn typegen` from the repo root, or `sanity schema extract &&
 * sanity typegen generate` from this directory.
 */
export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
  typegen: {
    path: '../web/sanity/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../web/sanity/types.ts',
    overloadClientMethods: true,
  },
})
