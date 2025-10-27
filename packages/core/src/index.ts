// ============================================================
// 核心导出
// ============================================================
export { createCodeEditor, CodeEditor } from './core/CodeEditor'

// ============================================================
// 性能优化
// ============================================================
export { EditorPool } from './core/EditorPool'
export type { PoolOptions, PoolStats } from './core/EditorPool'

export { MemoryManager, globalMemoryManager } from './core/MemoryManager'
export type { MemoryStats, MemoryThreshold, MemoryCallback } from './core/MemoryManager'

export {
  LazyLoader,
  languageLoader,
  themeLoader,
  pluginLoader,
} from './core/LazyLoader'

export {
  PerformanceMonitor,
  globalPerformanceMonitor,
  Measure,
} from './core/PerformanceMonitor'

// ============================================================
// 架构核心
// ============================================================
export { DIContainer, globalContainer, ServiceTokens } from './core/DependencyInjection'
export { EditorLifecycle, LifecyclePhase, LifecycleDecorator } from './core/EditorLifecycle'
export {
  MiddlewareManager,
  loggingMiddleware,
  performanceMiddleware,
  errorHandlingMiddleware,
  validationMiddleware,
  cacheMiddleware,
  throttleMiddleware,
  debounceMiddleware,
} from './core/Middleware'

// ============================================================
// 扩展系统
// ============================================================
export { ExtensionLoader, extensionLoader } from './core/ExtensionLoader'
export { ExtensionSandbox } from './core/ExtensionSandbox'

// ============================================================
// 工具函数
// ============================================================
export {
  debounce,
  throttle,
  rafThrottle,
  asyncDebounce,
  batchProcess,
  delay,
  withTimeout,
  retry,
} from './utils/debounce'

export {
  LRUCache,
  WeakCache,
  MemoryCache,
  Cacheable,
  memoize,
  globalCache,
} from './utils/cache'

// ============================================================
// AI 功能
// ============================================================
export { AIService } from './features/ai/AIService'
export { AICompletionProvider } from './features/ai/AICompletionProvider'
export { ContextAnalyzer } from './features/ai/ContextAnalyzer'
export { NaturalLanguageProcessor } from './features/ai/NaturalLanguageProcessor'

// ============================================================
// 协同编辑
// ============================================================
export { CollaborationManager } from './features/collaboration/CollaborationManager'
export { WebSocketClient } from './features/collaboration/WebSocketClient'
export { CRDTEngine } from './features/collaboration/CRDTEngine'
export { UserPresenceManager } from './features/collaboration/UserPresence'

// ============================================================
// 文件系统
// ============================================================
export { VirtualFileSystem } from './features/filesystem/VirtualFileSystem'
export { FileSearch } from './features/filesystem/FileSearch'
export { TabManager } from './features/filesystem/TabManager'

// ============================================================
// 调试功能
// ============================================================
export { DebugManager } from './features/debugger/DebugManager'
export { BreakpointManager } from './features/debugger/BreakpointManager'

// ============================================================
// 语言支持
// ============================================================
export { PythonLanguageService } from './languages/python/PythonLanguageService'
export { GoLanguageService } from './languages/go/GoLanguageService'
export { RustLanguageService } from './languages/rust/RustLanguageService'
export { JavaLanguageService } from './languages/java/JavaLanguageService'
export { LanguageRegistry, languageRegistry } from './languages/LanguageRegistry'

// ============================================================
// 代码片段
// ============================================================
export { SnippetLibrary } from './features/snippets/SnippetLibrary'
export { SnippetManager } from './features/snippets/SnippetManager'
export type { Snippet, SnippetCategory } from './features/snippets/SnippetLibrary'

// ============================================================
// 主题系统
// ============================================================
export { ThemeManager, themeManager } from './utils/themes'
export { ThemeEditor } from './features/theme/ThemeEditor'
export type { ThemeData } from './features/theme/ThemeEditor'

// ============================================================
// 快捷键系统
// ============================================================
export { KeybindingManager } from './features/keybindings/KeybindingManager'
export { VimMode } from './features/keybindings/VimMode'
export type { Keybinding } from './features/keybindings/KeybindingManager'

// ============================================================
// 命令系统
// ============================================================
export { CommandRegistry, commandRegistry } from './features/command/CommandRegistry'
export { CommandPalette } from './features/command/CommandPalette'
export type { Command } from './features/command/CommandRegistry'

// ============================================================
// 布局系统
// ============================================================
export { LayoutManager } from './features/layout/LayoutManager'
export type { LayoutConfig, EditorPane } from './features/layout/LayoutManager'

// ============================================================
// 原有功能
// ============================================================
export { EditorFeatureManager, createFeatureManager } from './utils/features'
export { PluginManager, registerCommonSnippets } from './utils/plugins'
export {
  normalizeLanguage,
  getLanguageByExtension,
  getRecommendedPlugins,
  supportsFormatting,
  getDefaultTabSize,
} from './utils/language-utils'
export { setupMonacoWorkers, preloadLanguages } from './utils/workers'
export { registerVueLanguage, registerReactLanguage } from './utils/languages'
export { registerEmmetProvider } from './utils/emmet'

// ============================================================
// 类型导出
// ============================================================
export * from './types'

// Monaco Editor 类型导出
export type { editor, languages, IRange, IPosition, Position } from 'monaco-editor'

