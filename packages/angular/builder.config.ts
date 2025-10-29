import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  entry: 'src/index.ts',
  formats: ['es', 'cjs'],
  dts: true,
  external: ['@angular/core', '@ldesign/code-editor-core', 'monaco-editor'],
  sourcemap: true,
  clean: true,
  framework: 'angular',
  umd: {
    enabled: false,
  },
})
