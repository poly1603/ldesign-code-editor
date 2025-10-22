/**
 * Vitest 测试环境设置
 */

import { beforeAll, afterEach } from 'vitest'

// 全局设置
beforeAll(() => {
  console.log('Test environment initialized')
})

// 每个测试后清理
afterEach(() => {
  // 清理 DOM
  document.body.innerHTML = ''
})

// Mock Monaco Editor
global.monaco = {
  editor: {
    create: () => ({}),
    defineTheme: () => { },
    setTheme: () => { },
  },
  languages: {
    register: () => { },
    registerCompletionItemProvider: () => ({ dispose: () => { } }),
  },
} as any

