import { tanstackConfig } from '@tanstack/eslint-config'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  ...tanstackConfig,

  // ✅ Add React Compiler ESLint plugin
  {
    plugins: {
      'react-compiler': require('eslint-plugin-react-compiler'),
    },
    rules: {
      // Error when a component breaks compiler optimization
      'react-compiler/react-compiler': 'error',
    },
  },
]
