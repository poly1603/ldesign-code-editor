import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  svelte: true,
  formatters: true,
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],
    'ts/no-explicit-any': 'warn',
    'ts/explicit-module-boundary-types': 'off',
    'ts/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'ts/no-non-null-assertion': 'warn',
    'ts/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    'prefer-const': 'error',
    'no-var': 'error',
  },
})
