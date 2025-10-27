import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ldesign/code-editor-core': resolve(__dirname, '../../packages/core/src/index.ts'),
      '@ldesign/code-editor-react': resolve(__dirname, '../../packages/react/src/index.ts')
    }
  },
  server: {
    port: 3002,
    open: true
  }
})

