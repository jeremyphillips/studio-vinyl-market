import studio from '@sanity/eslint-config-studio'
import sonarjs from 'eslint-plugin-sonarjs'

export default [...studio, sonarjs.configs.recommended]
