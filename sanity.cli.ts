import {config as loadEnv} from 'dotenv'
import {defineCliConfig} from 'sanity/cli'
import {getSanityApiConfig} from './sanity.project'

loadEnv()

const {projectId, dataset} = getSanityApiConfig()

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
})
