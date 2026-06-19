import loguxOxlintConfig from '@logux/oxc-configs/lint'
import { defineConfig } from 'oxlint'

export default defineConfig({
  extends: [loguxOxlintConfig],
  ignorePatterns: ['*/errors.ts'],
  rules: {
    'unicorn/consistent-function-scoping': 'off'
  },
  overrides: [
    {
      files: ['**/*.ts'],
      rules: {
        'typescript/no-explicit-any': 'off',
        'typescript/require-await': 'off'
      }
    }
  ]
})
