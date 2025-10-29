import { bench, describe } from 'vitest'
import { createCodeEditor } from '../core/CodeEditor'
import { LRUCache } from '../utils/cache'
import { debounce, throttle } from '../utils/debounce'

describe('Editor Performance Benchmarks', () => {
  describe('编辑器初始化', () => {
    bench('创建基础编辑器实例', () => {
      const container = document.createElement('div')
      const editor = createCodeEditor(container, {
        value: 'console.log("test")',
        language: 'javascript',
      })
      editor.dispose()
    })

    bench('创建带配置的编辑器', () => {
      const container = document.createElement('div')
      const editor = createCodeEditor(container, {
        value: 'const x = 1;\nconst y = 2;\nconst z = x + y;',
        language: 'typescript',
        theme: 'vs-dark',
        fontSize: 14,
        tabSize: 2,
        readOnly: false,
        minimap: true,
      })
      editor.dispose()
    })
  })

  describe('值操作性能', () => {
    const container = document.createElement('div')
    const editor = createCodeEditor(container)

    bench('获取编辑器值', () => {
      editor.getValue()
    })

    bench('设置编辑器值', () => {
      editor.setValue('test value')
    })

    bench('设置大文本（1000行）', () => {
      const largeText = Array.from({ length: 1000 }, (_, i) => `line ${i}`).join('\n')
      editor.setValue(largeText)
    })
  })

  describe('缓存性能', () => {
    const cache = new LRUCache<string, string>(100)

    bench('LRU Cache - 写入', () => {
      for (let i = 0; i < 100; i++) {
        cache.set(`key${i}`, `value${i}`)
      }
    })

    bench('LRU Cache - 读取', () => {
      for (let i = 0; i < 100; i++) {
        cache.get(`key${i}`)
      }
    })

    bench('LRU Cache - 混合读写', () => {
      for (let i = 0; i < 50; i++) {
        cache.set(`key${i}`, `value${i}`)
        cache.get(`key${i}`)
      }
    })
  })

  describe('工具函数性能', () => {
    bench('debounce 函数创建', () => {
      const fn = () => {}
      debounce(fn, 100)
    })

    bench('throttle 函数创建', () => {
      const fn = () => {}
      throttle(fn, 100)
    })

    bench('debounce 函数执行', () => {
      let count = 0
      const fn = debounce(() => count++, 10)
      for (let i = 0; i < 100; i++) {
        fn()
      }
    })

    bench('throttle 函数执行', () => {
      let count = 0
      const fn = throttle(() => count++, 10)
      for (let i = 0; i < 100; i++) {
        fn()
      }
    })
  })

  describe('字符串操作性能', () => {
    const longText = 'a'.repeat(10000)

    bench('大字符串拼接', () => {
      let result = ''
      for (let i = 0; i < 100; i++) {
        result += 'test'
      }
    })

    bench('Array join 拼接', () => {
      const arr = []
      for (let i = 0; i < 100; i++) {
        arr.push('test')
      }
      arr.join('')
    })

    bench('字符串搜索', () => {
      longText.indexOf('test')
    })

    bench('正则表达式搜索', () => {
      /test/.test(longText)
    })
  })
})
