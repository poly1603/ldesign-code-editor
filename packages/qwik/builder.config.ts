import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  entry: 'src/index.ts',
  formats: ['es', 'cjs'],
  dts: true,
  external: ['@builder.io/qwik', '@ldesign/code-editor-core', 'monaco-editor'],
  sourcemap: true,
  clean: true,
  framework: 'qwik',
  umd: {
    enabled: false,
  },
})
