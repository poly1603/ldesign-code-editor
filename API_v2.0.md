# API 文档 v2.0

## 核心 API

### 依赖注入

```typescript
import { DIContainer, globalContainer, ServiceTokens } from '@ldesign/code-editor'

// 创建容器
const container = new DIContainer()

// 注册服务
container.registerSingleton(ServiceTokens.AIService, (c) => new AIService(config))
container.registerTransient(token, factory)
container.registerScoped(token, factory)

// 解析服务
const service = container.resolve<AIService>(ServiceTokens.AIService)

// 检查服务
container.has(token) // boolean

// 创建子容器
const scope = container.createScope()
```

### 生命周期管理

```typescript
import { EditorLifecycle, LifecyclePhase } from '@ldesign/code-editor'

const lifecycle = new EditorLifecycle({
  beforeCreate: async () => { /* ... */ },
  created: async () => { /* ... */ },
  mounted: async () => { /* ... */ },
  disposed: async () => { /* ... */ }
})

// 注册钩子
const unsubscribe = lifecycle.on(LifecyclePhase.Ready, () => {
  console.log('Editor is ready!')
})

// 检查状态
lifecycle.isReady() // boolean
lifecycle.is(LifecyclePhase.Ready) // boolean
```

### 中间件系统

```typescript
import { 
  MiddlewareManager, 
  loggingMiddleware, 
  performanceMiddleware,
  errorHandlingMiddleware 
} from '@ldesign/code-editor'

const middleware = new MiddlewareManager()

// 添加中间件
middleware.use(loggingMiddleware)
middleware.use(performanceMiddleware(100))
middleware.use(errorHandlingMiddleware())

// 执行中间件链
await middleware.execute({
  data: someData,
  editor: editorInstance,
  timestamp: Date.now()
})
```

## 性能 API

### 懒加载

```typescript
import { 
  LazyLoader, 
  languageLoader,
  themeLoader,
  pluginLoader 
} from '@ldesign/code-editor'

// 加载语言
await languageLoader.loadLanguage('typescript')

// 预加载常用语言
await languageLoader.preloadCommonLanguages()

// 批量预加载
await loader.preloadBatch([
  { key: 'lang:js', loader: () => import('...') },
  { key: 'lang:ts', loader: () => import('...') }
])

// 检查加载状态
languageLoader.isLoaded('typescript') // boolean
```

### 性能监控

```typescript
import { globalPerformanceMonitor, Measure } from '@ldesign/code-editor'

// 标记和测量
monitor.mark('operation-start')
// ... 执行操作
monitor.mark('operation-end')
monitor.measure('operation', 'operation-start', 'operation-end', 'custom')

// 记录指标
monitor.recordMetric('editor-load', 1234, 'load')

// 生成报告
const report = monitor.generateReport()

// 监控 FPS
const fps = await monitor.monitorFPS(1000)

// 获取内存使用
const memory = monitor.getMemoryUsage()

// 装饰器
class MyClass {
  @Measure('interaction')
  async myMethod() {
    // ...
  }
}
```

### 缓存

```typescript
import { LRUCache, MemoryCache, memoize, Cacheable } from '@ldesign/code-editor'

// LRU 缓存
const cache = new LRUCache({
  maxSize: 100,
  ttl: 60000, // 1 minute
  onEvict: (key, value) => console.log('Evicted:', key)
})

cache.set('key', 'value')
const value = cache.get('key')

// Memoize 函数
const memoized = memoize(expensiveFunction)

// 装饰器
class MyClass {
  @Cacheable({ maxSize: 50 })
  expensiveMethod(arg: string) {
    // ...
  }
}
```

### 防抖节流

```typescript
import { 
  debounce, 
  throttle, 
  rafThrottle,
  asyncDebounce,
  retry 
} from '@ldesign/code-editor'

// 防抖
const debouncedFn = debounce(fn, 300)

// 节流
const throttledFn = throttle(fn, 100, { leading: true, trailing: true })

// RAF 节流
const rafThrottledFn = rafThrottle(fn)

// 异步防抖
const asyncDebouncedFn = asyncDebounce(asyncFn, 300)

// 重试
const result = await retry(asyncFn, 3, 1000)
```

### 内存管理

```typescript
import { globalMemoryManager, MemoryManager } from '@ldesign/code-editor'

// 获取内存统计
const stats = manager.getMemoryStats()

// 检查内存状态
const status = manager.checkMemoryStatus() // 'normal' | 'warning' | 'critical'

// 开始监控
manager.startMonitoring(5000)

// 监听内存变化
const unsubscribe = manager.onMemoryChange((stats) => {
  console.log('Memory usage:', stats.usagePercentage)
})

// 触发垃圾回收
manager.triggerGarbageCollection()

// 创建快照
const snapshot = manager.createSnapshot()

// 生成报告
console.log(manager.generateReport())
```

### 编辑器池

```typescript
import { EditorPool } from '@ldesign/code-editor'

const pool = new EditorPool(
  (container) => new CodeEditor(container, config),
  {
    minSize: 2,
    maxSize: 10,
    maxIdleTime: 5 * 60 * 1000,
    warmup: true
  }
)

// 获取编辑器
const editor = pool.acquire(container)

// 使用编辑器
// ...

// 释放编辑器
pool.release(editor)

// 获取统计
const stats = pool.getStats()
console.log(pool.generateReport())
```

## AI API

### AI 服务

```typescript
import { AIService } from '@ldesign/code-editor'

const aiService = new AIService({
  provider: 'openai',
  apiKey: 'your-api-key',
  model: 'gpt-4',
  maxTokens: 100,
  temperature: 0.7,
  timeout: 30000
})

// 代码补全
const completion = await aiService.getCompletion({
  prompt: 'function add',
  context: 'const x = 10',
  language: 'javascript'
})

// 自然语言转代码
const code = await aiService.naturalLanguageToCode({
  query: 'create a function that adds two numbers',
  targetLanguage: 'javascript'
})

// 解释代码
const explanation = await aiService.explainCode(code, context)

// 生成文档
const documentation = await aiService.generateDocumentation(code, 'javascript')

// 修复代码
const fixed = await aiService.fixCode(code, error, 'javascript')

// 优化代码
const optimized = await aiService.optimizeCode(code, 'javascript')

// 取消所有请求
aiService.cancelAll()
```

### AI 补全提供器

```typescript
import { AICompletionProvider } from '@ldesign/code-editor'
import * as monaco from 'monaco-editor'

const provider = new AICompletionProvider({
  aiService,
  triggerCharacters: ['.', '(', ' '],
  debounceDelay: 300,
  maxSuggestions: 5,
  enableInlineCompletion: true
})

// 注册到 Monaco
const disposable = provider.register(monaco, 'javascript')

// 注册内联补全
const inlineDisposable = provider.registerInlineCompletion(monaco, 'javascript')

// 清理
provider.dispose()
```

### 上下文分析器

```typescript
import { ContextAnalyzer } from '@ldesign/code-editor'

const analyzer = new ContextAnalyzer()

// 分析上下文
const context = analyzer.analyzeContext(model, position)
// {
//   beforeCursor: string
//   afterCursor: string
//   currentLine: string
//   language: string
//   fileName: string
//   imports: string[]
//   functions: string[]
//   variables: string[]
// }

// 检测上下文类型
const type = analyzer.detectContextType(context)
// 'import' | 'function' | 'class' | 'variable' | 'comment' | 'string' | 'unknown'

// 获取补全上下文
const completionContext = analyzer.getCompletionContext(context)
```

### 自然语言处理器

```typescript
import { NaturalLanguageProcessor } from '@ldesign/code-editor'

const nlp = new NaturalLanguageProcessor({
  aiService,
  defaultLanguage: 'javascript',
  enableTemplates: true
})

// 处理查询
const code = await nlp.process('create a function named add', context)

// 解析命令
const command = nlp.parseCommand('create a function named add with parameters x, y')

// 生成代码片段
const snippet = nlp.generateSnippet(command)

// 添加自定义模板
nlp.addTemplate('create api', 'async function ${name}() { ... }')

// 验证代码
const isValid = await nlp.validateCode(code, 'javascript')
```

## 工具 API

### 类型定义

```typescript
import type {
  // AI 类型
  AIConfig,
  AICompletionRequest,
  AICompletionResponse,
  CodeContext,
  AICompletionItem,
  NaturalLanguageRequest,
  CodeExplanation,
  CodeDocumentation,
  
  // 性能类型
  PerformanceMetric,
  PerformanceReport,
  MemoryStats,
  MemoryThreshold,
  
  // 缓存类型
  CacheOptions,
  CacheEntry,
  
  // 其他类型
  ServiceLifetime,
  ServiceDescriptor,
  LifecyclePhase,
  LifecycleHooks,
  MiddlewareContext,
  NextFunction,
  MiddlewareFunction,
} from '@ldesign/code-editor'
```

## 最佳实践

### 1. 使用依赖注入

```typescript
// ✅ 推荐
const container = new DIContainer()
container.registerSingleton(ServiceTokens.AIService, () => new AIService(config))
const service = container.resolve(ServiceTokens.AIService)

// ❌ 不推荐
const service = new AIService(config) // 直接实例化
```

### 2. 启用性能监控

```typescript
// 开发环境
if (process.env.NODE_ENV === 'development') {
  globalPerformanceMonitor.enable()
  globalPerformanceMonitor.observeLongTasks()
}
```

### 3. 使用缓存

```typescript
// 对于重复计算使用 memoize
const memoized = memoize(expensiveCalculation)

// 对于数据使用 LRU 缓存
const cache = new LRUCache({ maxSize: 100, ttl: 60000 })
```

### 4. 内存管理

```typescript
// 启用内存监控
globalMemoryManager.startMonitoring()
globalMemoryManager.setThresholds({ warning: 70, critical: 85 })
```

### 5. 懒加载

```typescript
// 预加载常用资源
await languageLoader.preloadCommonLanguages()

// 按需加载其他资源
editor.on('languageChange', async (lang) => {
  await languageLoader.loadLanguage(lang)
})
```

## 迁移指南

从 v1.x 迁移到 v2.0：

1. **无需更改现有代码** - v2.0 完全向后兼容
2. **逐步采用新功能** - 新功能都是可选的
3. **更新类型** - 如果使用 TypeScript，更新类型定义
4. **添加新依赖** - 如果使用 AI 功能，需要添加 API Key

## 示例

完整示例请参考：

- `examples/vanilla-demo/` - Vanilla JS 示例
- `examples/vue-demo/` - Vue 3 示例
- `OPTIMIZATION_REPORT.md` - 详细文档

## 支持

- GitHub Issues: [提交问题](https://github.com/...)
- 文档: [查看文档](./README.md)
- 更新日志: [查看更新](./CHANGELOG_v2.0.md)

