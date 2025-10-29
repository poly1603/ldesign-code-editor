import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  entry: 'src/index.ts',
  formats: ['es', 'cjs'],
  dts: true,
  external: ['react', 'react-dom', '@ldesign/code-editor-core', 'monaco-editor'],
  sourcemap: true,
  clean: true,
  framework: 'react',
  umd: {
    enabled: false,
  },
})
