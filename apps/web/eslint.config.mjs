import next from 'eslint-config-next'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'
import importX from 'eslint-plugin-import-x'
import jsxA11y from 'eslint-plugin-jsx-a11y'

const config = [
  ...next,
  ...nextCoreWebVitals,
  ...nextTypeScript,
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
    const {plugins, ...jsxA11yRecommended} = jsxA11y.flatConfigs.recommended
    void plugins
    return jsxA11yRecommended
  })(),
]

export default config
