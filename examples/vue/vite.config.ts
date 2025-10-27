import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@ldesign/code-editor-core': resolve(__dirname, '../../packages/core/src/index.ts'),
      '@ldesign/code-editor-vue': resolve(__dirname, '../../packages/vue/src/index.ts')
    }
  },
  server: {
    port: 3001,
    open: true
  }
})

