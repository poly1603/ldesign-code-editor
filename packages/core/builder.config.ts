import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  entry: 'src/index.ts',
  dts: true,
  external: ['monaco-editor'],
  sourcemap: true,
  clean: true,
  output: {
    esm: true,
    cjs: true,
  },
})
