# 使用指南

## 📖 目录

1. [基础使用](#基础使用)
2. [AI 功能](#ai-功能)
3. [协同编辑](#协同编辑)
4. [文件管理](#文件管理)
5. [调试功能](#调试功能)
6. [性能优化](#性能优化)
7. [高级功能](#高级功能)

---

## 基础使用

### 创建编辑器

```typescript
import { createCodeEditor } from '@ldesign/code-editor'

const editor = createCodeEditor('#editor', {
  value: 'console.log("Hello")',
  language: 'javascript',
  theme: 'vs-dark'
})
```

### 增强型编辑器

```typescript
import { createEnhancedCodeEditor } from '@ldesign/code-editor'

const editor = createEnhancedCodeEditor('#editor', {
  value: 'console.log("Hello")',
  language: 'javascript',
  theme: 'tokyo-night',
  showLoading: true,
  plugins: {
    emmet: true,
    snippets: true
  }
})
```

### Vue 3 组件

```vue
<template>
  <CodeEditor
    v-model="code"
    language="javascript"
    theme="tokyo-night"
    height="400px"
  />
</template>

<script setup>
import { ref } from 'vue'
import { CodeEditor } from '@ldesign/code-editor/vue'

const code = ref('console.log("Hello")')
</script>
```

---

## AI 功能

### 启用 AI 补全

```typescript
import { AIService, AICompletionProvider } from '@ldesign/code-editor'
import * as monaco from 'monaco-editor'

// 创建 AI 服务
const aiService = new AIService({
  provider: 'openai',
  apiKey: 'sk-...',
  model: 'gpt-4'
})

// 创建补全提供器
const provider = new AICompletionProvider({
  aiService,
  enableInlineCompletion: true
})

// 注册
provider.register(monaco, 'javascript')
```

### 自然语言转代码

```typescript
import { NaturalLanguageProcessor } from '@ldesign/code-editor'

const nlp = new NaturalLanguageProcessor({ aiService })

const code = await nlp.process(
  'create a function that adds two numbers'
)
// 输出: function add(x, y) { return x + y; }
```

### 代码解释

```typescript
const explanation = await aiService.explainCode(code)
console.log(explanation.summary)
console.log(explanation.details)
```

---

## 协同编辑

### 基础协同

```typescript
import { CollaborationManager } from '@ldesign/code-editor'

const collaboration = new CollaborationManager({
  enabled: true,
  serverUrl: 'wss://your-server.com',
  roomId: 'room-123',
  user: {
    id: 'user-1',
    name: 'Alice',
    color: '#007acc'
  }
}, {
  onUserJoined: (user) => console.log('User joined:', user.name),
  onUserLeft: (userId) => console.log('User left:', userId),
  onEdit: (operation) => console.log('Remote edit:', operation)
})

await collaboration.connect()
```

### 发送编辑操作

```typescript
editor.on('change', (value, event) => {
  const operation = {
    type: 'insert',
    position: { line: 1, column: 0 },
    content: value,
    version: 1,
    userId: 'user-1',
    timestamp: Date.now()
  }
  
  collaboration.sendEdit(operation)
})
```

---

## 文件管理

### 虚拟文件系统

```typescript
import { VirtualFileSystem } from '@ldesign/code-editor'

const fs = new VirtualFileSystem()

// 创建文件
await fs.createFile('/src/main.ts', 'console.log("Hello")')

// 读取文件
const content = await fs.readFile('/src/main.ts')

// 写入文件
await fs.writeFile('/src/main.ts', 'console.log("Updated")')

// 删除文件
await fs.deleteFile('/src/main.ts')

// 创建目录
await fs.createDirectory('/src/components')

// 列出目录
const files = fs.listDirectory('/src')
```

### 文件树组件

```vue
<template>
  <FileTree
    :root="fileRoot"
    @select="handleFileSelect"
    @create="handleFileCreate"
    @delete="handleFileDelete"
  />
</template>

<script setup>
import { FileTree } from '@ldesign/code-editor'

const fileRoot = ref({
  id: 'root',
  name: '/',
  type: 'directory',
  children: []
})
</script>
```

### 标签页管理

```typescript
import { TabManager } from '@ldesign/code-editor'

const tabManager = new TabManager()

// 打开标签
const tab = tabManager.openTab(file, content)

// 切换标签
tabManager.setActiveTab(tab.id)

// 关闭标签
tabManager.closeTab(tab.id)

// 标记为脏
tabManager.markDirty(tab.id, true)
```

---

## 调试功能

### 断点管理

```typescript
import { BreakpointManager } from '@ldesign/code-editor'

const bpManager = new BreakpointManager()
bpManager.setEditor(editor.getEditor())

// 添加断点
bpManager.addBreakpoint(10) // 第 10 行

// 条件断点
bpManager.addBreakpoint(15, 'x > 10')

// 切换断点
bpManager.toggleBreakpoint(10)

// 获取所有断点
const breakpoints = bpManager.getBreakpoints()
```

### 调试管理器

```typescript
import { DebugManager } from '@ldesign/code-editor'

const debugManager = new DebugManager({
  enabled: true,
  pauseOnException: true
})

// 暂停/继续
debugManager.pause()
debugManager.resume()

// 单步调试
debugManager.stepOver()
debugManager.stepInto()
debugManager.stepOut()

// 求值表达式
const result = await debugManager.evaluateExpression('x + y')

// 获取调用栈
const callStack = debugManager.getCallStack()

// 获取变量
const variables = debugManager.getVariables()
```

---

## 性能优化

### 启用性能监控

```typescript
import { globalPerformanceMonitor } from '@ldesign/code-editor'

// 启用监控
globalPerformanceMonitor.enable()

// 标记性能点
globalPerformanceMonitor.mark('init-start')
// ... 初始化
globalPerformanceMonitor.mark('init-end')

// 测量性能
globalPerformanceMonitor.measure('init', 'init-start', 'init-end', 'load')

// 生成报告
console.log(globalPerformanceMonitor.generateReport())

// 监控 FPS
const fps = await globalPerformanceMonitor.monitorFPS()
console.log('FPS:', fps)

// 获取内存使用
const memory = globalPerformanceMonitor.getMemoryUsage()
```

### 使用懒加载

```typescript
import { languageLoader } from '@ldesign/code-editor'

// 预加载常用语言
await languageLoader.preloadCommonLanguages()

// 按需加载
editor.on('languageChange', async (lang) => {
  await languageLoader.loadLanguage(lang)
})

// 检查加载状态
if (languageLoader.isLoaded('typescript')) {
  console.log('TypeScript is ready')
}
```

### 使用缓存

```typescript
import { LRUCache, memoize } from '@ldesign/code-editor'

// LRU 缓存
const cache = new LRUCache({
  maxSize: 100,
  ttl: 60000 // 1 分钟
})

cache.set('key', 'value')
const value = cache.get('key')

// Memoize 函数
const expensive = memoize((x) => {
  // 复杂计算
  return x * 2
})

// 装饰器
class MyClass {
  @Cacheable({ maxSize: 50 })
  expensiveMethod(arg: string) {
    // ...
  }
}
```

### 内存管理

```typescript
import { globalMemoryManager } from '@ldesign/code-editor'

// 开始监控
globalMemoryManager.startMonitoring(5000)

// 设置阈值
globalMemoryManager.setThresholds({
  warning: 75,
  critical: 90
})

// 监听变化
globalMemoryManager.onMemoryChange((stats) => {
  console.log('Memory:', stats.usagePercentage.toFixed(2) + '%')
})

// 生成报告
console.log(globalMemoryManager.generateReport())
```

### 使用编辑器池

```typescript
import { EditorPool } from '@ldesign/code-editor'

const pool = new EditorPool(
  (container) => createCodeEditor(container, config),
  {
    minSize: 2,
    maxSize: 10,
    warmup: true
  }
)

// 获取编辑器
const editor = pool.acquire(container)

// 使用后释放
pool.release(editor)

// 查看统计
console.log(pool.generateReport())
```

---

## 高级功能

### 依赖注入

```typescript
import { DIContainer, ServiceTokens } from '@ldesign/code-editor'

const container = new DIContainer()

// 注册服务
container.registerSingleton(
  ServiceTokens.AIService,
  () => new AIService(config)
)

// 解析服务
const aiService = container.resolve(ServiceTokens.AIService)
```

### 生命周期钩子

```typescript
import { EditorLifecycle } from '@ldesign/code-editor'

const lifecycle = new EditorLifecycle({
  beforeCreate: async () => {
    console.log('Before create')
  },
  created: async () => {
    console.log('Created')
  },
  mounted: async () => {
    console.log('Mounted')
  },
  disposed: async () => {
    console.log('Disposed')
  }
})
```

### 中间件

```typescript
import { 
  MiddlewareManager,
  loggingMiddleware,
  performanceMiddleware
} from '@ldesign/code-editor'

const middleware = new MiddlewareManager()

middleware.use(loggingMiddleware)
middleware.use(performanceMiddleware(100))
middleware.use(async (ctx, next) => {
  console.log('Before')
  await next()
  console.log('After')
})

await middleware.execute({
  data: someData,
  editor: editorInstance,
  timestamp: Date.now()
})
```

### 命令面板

```typescript
import { CommandRegistry, CommandPalette } from '@ldesign/code-editor'

const registry = new CommandRegistry()

// 注册命令
registry.registerCommand({
  id: 'editor.format',
  title: 'Format Document',
  category: 'Editor',
  handler: () => editor.format()
})

// 创建命令面板
const palette = new CommandPalette(registry, {
  fuzzySearch: true,
  maxResults: 20
})

// 搜索命令
const commands = palette.search('format')

// 执行命令
await palette.executeSelected(commands)
```

### 布局系统

```typescript
import { LayoutManager } from '@ldesign/code-editor'

const layoutManager = new LayoutManager(container)

// 水平分屏
layoutManager.splitHorizontal()

// 垂直分屏
layoutManager.splitVertical()

// 自定义布局
layoutManager.setLayout({
  type: 'grid',
  sizes: [50, 50],
  editors: [
    { id: '1', content: 'code1', language: 'js' },
    { id: '2', content: 'code2', language: 'ts' }
  ]
})

// 保存布局
const layout = layoutManager.saveLayout()
localStorage.setItem('layout', JSON.stringify(layout))
```

### Vim 模式

```typescript
import { VimMode } from '@ldesign/code-editor'

const vim = new VimMode()
vim.setEditor(editor.getEditor())

// 启用 Vim 模式
vim.enable()

// 禁用 Vim 模式
vim.disable()

// 获取当前模式
const mode = vim.getMode() // 'normal' | 'insert' | 'visual'
```

---

## 🎯 最佳实践

### 1. 开发环境

```typescript
if (process.env.NODE_ENV === 'development') {
  // 启用监控
  globalPerformanceMonitor.enable()
  globalMemoryManager.startMonitoring()
}
```

### 2. 生产环境

```typescript
const editor = createEnhancedCodeEditor('#editor', {
  // 性能优化
  performance: {
    largeFileOptimizations: true,
    virtualScrolling: true
  },
  
  // 按需加载
  plugins: {
    emmet: language === 'html',
    snippets: true
  }
})
```

### 3. 资源清理

```typescript
// Vue
onBeforeUnmount(() => {
  editor?.dispose()
  collaboration?.dispose()
  globalMemoryManager.stopMonitoring()
})

// React
useEffect(() => {
  return () => {
    editor?.dispose()
  }
}, [])

// Vanilla
window.addEventListener('beforeunload', () => {
  editor.dispose()
})
```

---

## 📚 更多资源

- [API 文档](./API_v2.0.md) - 完整 API 参考
- [功能清单](./FEATURES_v2.0.md) - 所有功能列表
- [快速开始](./QUICK_START_v2.0.md) - 5 分钟上手
- [完成报告](./🎊全部完成报告.md) - 项目总结

---

**版本**: 2.0.0  
**最后更新**: 2025-01-22

