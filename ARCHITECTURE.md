# 架构设计文档

## 🏗️ 总体架构

### 分层架构

```
┌──────────────────────────────────────────────────┐
│              应用层 (Application Layer)           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Vanilla │  │   Vue 3  │  │  React   │       │
│  └──────────┘  └──────────┘  └──────────┘       │
└──────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────┐
│              功能层 (Feature Layer)               │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  │
│  │ AI  │  │协同 │  │文件 │  │调试 │  │扩展 │  │
│  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  │
└──────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────┐
│              核心层 (Core Layer)                  │
│  ┌────────┐  ┌────────┐  ┌────────┐            │
│  │ Editor │  │   DI   │  │Lifecycle│            │
│  └────────┘  └────────┘  └────────┘            │
└──────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────┐
│             性能层 (Performance Layer)            │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐            │
│  │缓存 │  │监控 │  │内存 │  │加载 │            │
│  └─────┘  └─────┘  └─────┘  └─────┘            │
└──────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────┐
│            基础层 (Foundation Layer)              │
│          Monaco Editor + TypeScript               │
└──────────────────────────────────────────────────┘
```

## 🔧 核心组件

### 1. 依赖注入容器

```typescript
DIContainer
├── ServiceDescriptor
├── ServiceLifetime (singleton/transient/scoped)
└── ServiceTokens
```

**职责**: 管理服务的注册、解析和生命周期

### 2. 生命周期管理器

```typescript
EditorLifecycle
├── LifecyclePhase (creating/initializing/ready...)
├── LifecycleHooks (beforeCreate/created/mounted...)
└── Event Listeners
```

**职责**: 管理编辑器的完整生命周期

### 3. 中间件管理器

```typescript
MiddlewareManager
├── MiddlewareFunction[]
├── MiddlewareContext
└── NextFunction
```

**职责**: 实现请求拦截和处理链

## 🤖 AI 架构

### AI 服务层

```
AIService
├── OpenAI Provider
├── Claude Provider
└── Custom Provider

支持功能:
- 代码补全
- NL2Code
- 代码解释
- 文档生成
- 代码修复
- 代码优化
```

### AI 补全层

```
AICompletionProvider
├── ContextAnalyzer (上下文分析)
├── CompletionItems (补全项)
└── InlineCompletion (内联补全)
```

### 自然语言层

```
NaturalLanguageProcessor
├── Template Matcher
├── Command Parser
└── Snippet Generator
```

## 👥 协同架构

### 通信层

```
WebSocketClient
├── Connection Management
├── Reconnection Logic
├── Heartbeat
└── Message Queue
```

### 同步层

```
CRDTEngine (WOOT Algorithm)
├── Lamport Clock
├── Operation Transformation
├── Conflict Resolution
└── Version Management
```

### 状态层

```
UserPresenceManager
├── User Tracking
├── Cursor Sync
├── Selection Sync
└── Online Status
```

## 📁 文件系统架构

### 虚拟文件系统

```
VirtualFileSystem
├── FileNode (Tree Structure)
├── CRUD Operations
├── Path Resolution
└── Parent/Child Management
```

### UI 层

```
FileTree (Vue Component)
├── FileTreeNode (Recursive)
├── Drag & Drop
└── Context Menu
```

### 管理层

```
TabManager
├── Tab Info
├── Active Tab Tracking
├── Dirty State
└── Tab Events
```

## 🐛 调试架构

### 断点层

```
BreakpointManager
├── Breakpoint Storage
├── Conditional Breakpoints
├── Visual Decorations
└── Hit Count
```

### 调试控制层

```
DebugManager
├── Pause/Resume
├── Step Over/Into/Out
├── Expression Evaluation
└── State Management
```

## ⚡ 性能架构

### 加载优化

```
LazyLoader
├── Language Loader
├── Theme Loader
├── Plugin Loader
├── Retry Logic
└── Timeout Control
```

### 缓存系统

```
Cache System
├── LRUCache (LRU Algorithm)
├── WeakCache (WeakMap)
├── MemoryCache (Auto Cleanup)
└── Global Cache Instance
```

### 监控系统

```
PerformanceMonitor
├── Metrics Collection
├── FPS Monitoring
├── Long Task Detection
├── Memory Tracking
└── Report Generation
```

### 内存管理

```
MemoryManager
├── Real-time Monitoring
├── Threshold Alerts
├── GC Triggering
├── Leak Detection
└── Snapshot Comparison
```

### 实例池

```
EditorPool
├── Pool Management
├── Instance Reuse
├── Auto Cleanup
└── Warmup Support
```

## 🔌 扩展架构

### 加载层

```
ExtensionLoader
├── Extension Registry
├── Activation Events
├── Contribution Points
└── Context Management
```

### 沙箱层

```
ExtensionSandbox
├── iframe Isolation
├── Message Passing
├── Security Control
└── Resource Limits
```

## 📊 数据流

### 编辑器数据流

```
User Input
    ↓
Event Handlers
    ↓
Middleware Chain
    ↓
Editor Core
    ↓
Monaco Editor
    ↓
Render
```

### AI 补全数据流

```
User Typing
    ↓
Context Analyzer
    ↓
AI Service
    ↓
Completion Provider
    ↓
Monaco Suggestions
    ↓
User Selection
```

### 协同数据流

```
Local Edit
    ↓
CRDT Engine
    ↓
WebSocket Client
    ↓
Server
    ↓
Other Clients
    ↓
CRDT Engine
    ↓
Editor Update
```

## 🎯 设计原则

### SOLID 原则

- **S**ingle Responsibility - 每个类单一职责
- **O**pen/Closed - 对扩展开放，对修改关闭
- **L**iskov Substitution - 子类可替换父类
- **I**nterface Segregation - 接口隔离
- **D**ependency Inversion - 依赖倒置

### 其他原则

- **DRY** - Don't Repeat Yourself
- **KISS** - Keep It Simple, Stupid
- **YAGNI** - You Aren't Gonna Need It
- **高内聚低耦合**
- **面向接口编程**

## 🔄 扩展性

### 添加新功能

1. 定义类型 (`src/types/`)
2. 实现服务 (`src/features/`)
3. 注册到 DI 容器
4. 导出 API (`src/index.ts`)
5. 添加文档
6. 编写测试

### 添加新语言

1. 创建语言服务 (`src/languages/{lang}/`)
2. 注册到 `LanguageRegistry`
3. 添加补全提供器
4. 配置语言默认值

### 添加新主题

1. 定义主题数据
2. 注册到 `ThemeManager`
3. 导出主题

---

**版本**: 2.0.0  
**最后更新**: 2025-01-22

