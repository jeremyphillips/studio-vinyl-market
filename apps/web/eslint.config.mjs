import next from 'eslint-config-next'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'
import importX from 'eslint-plugin-import-x'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import sonarjs from 'eslint-plugin-sonarjs'

const config = [
  ...next,
  ...nextCoreWebVitals,
  ...nextTypeScript,
  sonarjs.configs.recommended,
  {
    ignores: ['.next/**', 'node_modules/**', 'sanity/types.ts', 'storybook-static/**'],
  },
  {
    plugins: { 'import-x': importX },
    rules: {
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import-x/no-duplicates': 'error',
    },
    settings: {
      'import-x/resolver': { typescript: true },
    },
  },
  // eslint-config-next already declares the jsx-a11y plugin; spread only the rules
  // to avoid a "Cannot redefine plugin" flat-config error.
  (() => {
    const jsxA11yRecommended = { ...jsxA11y.flatConfigs.recommended }
    // eslint-config-next already registers jsx-a11y; drop duplicate plugin registration.
    delete jsxA11yRecommended.plugins
    return jsxA11yRecommended
  })(),
  {
    files: ['app/error.tsx'],
    rules: {
      // Next.js error boundaries must export a component named `Error`.
      'sonarjs/no-globals-shadowing': 'off',
    },
  },
]

export default config
