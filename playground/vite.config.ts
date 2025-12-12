import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@ldesign/code-editor-core': resolve(__dirname, '../packages/core/src/index.ts'),
      '@ldesign/code-editor-vue': resolve(__dirname, '../packages/vue/src/index.ts')
    }
  },
  optimizeDeps: {
    include: ['monaco-editor']
  },
  server: {
    port: 5173,
    host: true
  }
})
