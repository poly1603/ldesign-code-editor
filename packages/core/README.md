# @ldesign/code-editor-core

企业级代码编辑器核心包，基于 Monaco Editor。

## 特性

- 🚀 **高性能** - 优化的内存管理和编辑器池
- 🎨 **框架无关** - 可在任何 JavaScript 框架中使用
- 🛠️ **完整功能** - AI 补全、协同编辑、调试等
- 📦 **TypeScript** - 完整的类型定义
- 🔌 **可扩展** - 强大的插件系统

## 安装

```bash
npm install @ldesign/code-editor-core monaco-editor
# 或
pnpm add @ldesign/code-editor-core monaco-editor
```

## 快速开始

```typescript
import { createCodeEditor } from '@ldesign/code-editor-core'
import * as monaco from 'monaco-editor'

// 创建编辑器
const editor = createCodeEditor(document.getElementById('editor'), {
  language: 'javascript',
  theme: 'vs-dark',
  value: 'console.log("Hello World")',
  fontSize: 14,
  minimap: true
})

// 获取值
console.log(editor.getValue())

// 设置值
editor.setValue('const x = 1')

// 监听变化
editor.config.on = {
  change: (value) => console.log('Changed:', value)
}
```

## 高级功能

### 编辑器池

```typescript
import { EditorPool, CodeEditor } from '@ldesign/code-editor-core'

const pool = new EditorPool(
  (container) => new CodeEditor(container),
  {
    minSize: 2,
    maxSize: 10,
    warmup: true
  }
)

const editor = pool.acquire(container)
// ... 使用编辑器
pool.release(editor)
```

### 内存管理

```typescript
import { globalMemoryManager } from '@ldesign/code-editor-core'

// 监控内存
globalMemoryManager.startMonitoring(5000)
globalMemoryManager.onMemoryChange((stats) => {
  console.log('Memory usage:', stats.usagePercentage + '%')
})

// 获取报告
console.log(globalMemoryManager.generateReport())
```

### 性能监控

```typescript
import { globalPerformanceMonitor, Measure } from '@ldesign/code-editor-core'

@Measure()
async function myFunction() {
  // ...
}

const metrics = globalPerformanceMonitor.getMetrics('myFunction')
console.log(globalPerformanceMonitor.generateReport())
```

## API 文档

完整的 API 文档请查看类型定义文件或访问在线文档。

## License

MIT

