import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: true,
  formatters: true,
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],
    'ts/no-explicit-any': 'warn',
    'ts/explicit-module-boundary-types': 'off',
    'ts/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'ts/no-non-null-assertion': 'warn',
    'ts/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    'vue/multi-word-component-names': 'off',
    'vue/require-default-prop': 'off',
    'vue/no-v-html': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
  },
})
