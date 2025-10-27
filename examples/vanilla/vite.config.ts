import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@ldesign/code-editor-core': resolve(__dirname, '../../packages/core/src/index.ts')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})

