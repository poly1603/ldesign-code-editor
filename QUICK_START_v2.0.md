# 快速开始 v2.0

> 5 分钟上手 @ldesign/code-editor v2.0 的新功能

## 📦 安装

```bash
pnpm add @ldesign/code-editor monaco-editor
```

## 🚀 基础使用

### 1. 创建基础编辑器（无变化）

```typescript
import { createCodeEditor } from '@ldesign/code-editor'

const editor = createCodeEditor('#editor', {
  value: 'console.log("Hello World!")',
  language: 'javascript',
  theme: 'vs-dark'
})
```

### 2. 创建增强编辑器（推荐）

```typescript
import { createEnhancedCodeEditor } from '@ldesign/code-editor'

const editor = createEnhancedCodeEditor('#editor', {
  value: 'console.log("Hello World!")',
  language: 'javascript',
  theme: 'vs-dark',
  showLoading: true, // 显示加载动画
})
```

## 🤖 使用 AI 功能

### 启用 AI 代码补全

```typescript
import { 
  createEnhancedCodeEditor,
  AIService,
  AICompletionProvider 
} from '@ldesign/code-editor'
import * as monaco from 'monaco-editor'

// 1. 创建 AI 服务
const aiService = new AIService({
  provider: 'openai', // 或 'claude'
  apiKey: 'your-api-key',
  model: 'gpt-4',
  maxTokens: 100
})

// 2. 创建补全提供器
const completionProvider = new AICompletionProvider({
  aiService,
  enableInlineCompletion: true // 类似 Copilot 的内联补全
})

// 3. 注册到编辑器
completionProvider.register(monaco, 'javascript')
completionProvider.registerInlineCompletion(monaco, 'javascript')

// 4. 创建编辑器
const editor = createEnhancedCodeEditor('#editor', {
  language: 'javascript',
  value: '// 开始输入，AI 会自动提示...'
})
```

### 使用自然语言生成代码

```typescript
import { AIService, NaturalLanguageProcessor } from '@ldesign/code-editor'

const aiService = new AIService({ /* config */ })
const nlp = new NaturalLanguageProcessor({ aiService })

// 自然语言转代码
const code = await nlp.process('create a function that adds two numbers')
console.log(code)
// 输出: function add(x, y) { return x + y; }
```

## ⚡ 性能优化

### 启用性能监控

```typescript
import { globalPerformanceMonitor } from '@ldesign/code-editor'

// 启用监控
globalPerformanceMonitor.enable()

// 监控编辑器初始化
globalPerformanceMonitor.mark('init-start')
const editor = createCodeEditor('#editor', config)
globalPerformanceMonitor.mark('init-end')
globalPerformanceMonitor.measure('init', 'init-start', 'init-end', 'load')

// 查看报告
console.log(globalPerformanceMonitor.generateReport())
```

### 使用懒加载

```typescript
import { languageLoader } from '@ldesign/code-editor'

// 预加载常用语言
await languageLoader.preloadCommonLanguages()

// 按需加载
editor.on('languageChange', async (language) => {
  await languageLoader.loadLanguage(language)
})
```

### 使用缓存

```typescript
import { LRUCache, memoize } from '@ldesign/code-editor'

// 创建缓存
const cache = new LRUCache({
  maxSize: 100,
  ttl: 60000 // 1 分钟
})

cache.set('key', 'value')
const value = cache.get('key')

// 或使用 memoize
const expensive = memoize((x) => {
  // 复杂计算
  return x * 2
})
```

## 💾 内存管理

### 启用内存监控

```typescript
import { globalMemoryManager } from '@ldesign/code-editor'

// 开始监控
globalMemoryManager.startMonitoring(5000) // 每 5 秒检查

// 设置阈值
globalMemoryManager.setThresholds({
  warning: 75,  // 75% 时警告
  critical: 90  // 90% 时严重警告
})

// 监听变化
globalMemoryManager.onMemoryChange((stats) => {
  console.log(`内存使用: ${stats.usagePercentage.toFixed(2)}%`)
  
  if (stats.usagePercentage > 80) {
    console.warn('内存使用过高！')
  }
})
```

### 使用编辑器池

```typescript
import { EditorPool } from '@ldesign/code-editor'

// 创建池
const pool = new EditorPool(
  (container) => createCodeEditor(container, config),
  {
    minSize: 2,
    maxSize: 10,
    warmup: true // 预热
  }
)

// 获取编辑器
const editor = pool.acquire(container)

// 使用编辑器
// ...

// 释放回池
pool.release(editor)
```

## 🏗️ 高级功能

### 使用依赖注入

```typescript
import { DIContainer, ServiceTokens } from '@ldesign/code-editor'

const container = new DIContainer()

// 注册服务
container.registerSingleton(ServiceTokens.AIService, () => 
  new AIService({ /* config */ })
)

// 解析服务
const aiService = container.resolve(ServiceTokens.AIService)
```

### 使用生命周期钩子

```typescript
import { createEnhancedCodeEditor, EditorLifecycle } from '@ldesign/code-editor'

const lifecycle = new EditorLifecycle({
  beforeCreate: async () => {
    console.log('编辑器即将创建...')
  },
  mounted: async () => {
    console.log('编辑器已就绪！')
  },
  disposed: async () => {
    console.log('编辑器已销毁')
  }
})

const editor = createEnhancedCodeEditor('#editor', {
  // ... config
})
```

### 使用中间件

```typescript
import { 
  MiddlewareManager,
  loggingMiddleware,
  performanceMiddleware 
} from '@ldesign/code-editor'

const middleware = new MiddlewareManager()

middleware.use(loggingMiddleware)
middleware.use(performanceMiddleware(100)) // 超过 100ms 警告

// 执行中间件链
await middleware.execute({
  data: someData,
  editor: editorInstance,
  timestamp: Date.now()
})
```

## 🎨 实用工具

### 防抖和节流

```typescript
import { debounce, throttle } from '@ldesign/code-editor'

// 防抖保存
const debouncedSave = debounce(saveFunction, 500)
editor.on('change', debouncedSave)

// 节流搜索
const throttledSearch = throttle(searchFunction, 200)
searchInput.addEventListener('input', throttledSearch)
```

### 装饰器

```typescript
import { Measure, Cacheable } from '@ldesign/code-editor'

class MyService {
  // 性能监控
  @Measure('interaction')
  async processData(data: any) {
    // ...
  }
  
  // 缓存结果
  @Cacheable({ maxSize: 50 })
  expensiveCalculation(input: string) {
    // ...
  }
}
```

## 📊 最佳实践

### 1. 开发环境启用监控

```typescript
if (process.env.NODE_ENV === 'development') {
  // 性能监控
  globalPerformanceMonitor.enable()
  globalPerformanceMonitor.observeLongTasks()
  
  // 内存监控
  globalMemoryManager.startMonitoring()
}
```

### 2. 生产环境优化

```typescript
const editor = createEnhancedCodeEditor('#editor', {
  // 懒加载
  showLoading: true,
  
  // 性能优化
  performance: {
    largeFileOptimizations: true,
    virtualScrolling: true
  },
  
  // 按需加载插件
  plugins: {
    emmet: language === 'html',
    snippets: true
  }
})
```

### 3. 正确清理资源

```typescript
// Vue 3 组件
onBeforeUnmount(() => {
  editor?.dispose()
  pool?.dispose()
  globalMemoryManager.stopMonitoring()
})

// React 组件
useEffect(() => {
  return () => {
    editor?.dispose()
  }
}, [])

// Vanilla JS
window.addEventListener('beforeunload', () => {
  editor.dispose()
})
```

## 🔗 相关资源

- **完整 API**: [API_v2.0.md](./API_v2.0.md)
- **优化报告**: [OPTIMIZATION_REPORT.md](./OPTIMIZATION_REPORT.md)
- **更新日志**: [CHANGELOG_v2.0.md](./CHANGELOG_v2.0.md)
- **实施总结**: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

## ❓ 常见问题

### Q: v2.0 与 v1.x 兼容吗？

是的，完全向后兼容。所有新功能都是可选的。

### Q: 必须使用 AI 功能吗？

不是，AI 功能完全可选。不使用也不影响基础功能。

### Q: 如何获取 AI API Key？

- OpenAI: https://platform.openai.com/
- Claude: https://www.anthropic.com/

### Q: 性能监控会影响性能吗？

轻微影响（<1%），建议只在开发环境启用。

### Q: 如何迁移现有代码？

无需迁移，v2.0 完全兼容 v1.x。只需按需使用新功能。

## 💬 获取帮助

- GitHub Issues: 报告问题
- 文档: 查看完整文档
- 示例: 查看 examples/ 目录

---

**开始使用**: `pnpm add @ldesign/code-editor monaco-editor`  
**文档版本**: 2.0.0-alpha  
**最后更新**: 2025-01-22

