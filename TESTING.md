# 测试指南

## 测试策略

本项目采用多层次的测试策略，确保代码质量和稳定性。

## 测试类型

### 1. 单元测试

使用 Vitest 进行单元测试。

**运行测试：**
```bash
# 所有包的单元测试
pnpm -r test

# 单个包的测试
cd packages/core
pnpm test

# Watch 模式
pnpm test --watch

# UI 模式
pnpm test:ui
```

**测试覆盖率：**
```bash
# 生成覆盖率报告
pnpm -r test:coverage

# 查看覆盖率报告
open packages/core/coverage/index.html
```

**目标覆盖率：**
- Core 包: > 80%
- 框架包: > 70%

### 2. 性能测试

使用 Vitest 的 benchmark 功能进行性能测试。

**运行性能测试：**
```bash
cd packages/core
pnpm test src/__tests__/performance.bench.ts
```

**性能指标：**
- 编辑器初始化: < 100ms
- 大文件加载 (1MB): < 500ms
- 内存使用: < 50MB
- FPS: > 55

### 3. 组件测试

**Vue 组件测试：**
```bash
cd packages/vue
pnpm test
```

使用 @vue/test-utils 和 Vitest 测试 Vue 组件。

**React 组件测试：**
```bash
cd packages/react
pnpm test
```

使用 @testing-library/react 和 Vitest 测试 React 组件。

### 4. 视觉回归测试

使用 Playwright 进行视觉回归测试（待实现）。

```bash
# 安装 Playwright
pnpm add -D @playwright/test

# 运行视觉测试
pnpm test:visual
```

### 5. 端到端测试

使用 Playwright 进行 E2E 测试（待实现）。

```bash
# 运行 E2E 测试
pnpm test:e2e
```

## 测试文件组织

```
packages/
├── core/
│   └── src/
│       ├── __tests__/
│       │   ├── CodeEditor.test.ts
│       │   ├── performance.bench.ts
│       │   ├── PerformanceMonitor.test.ts
│       │   └── utils/
│       │       ├── cache.test.ts
│       │       └── debounce.test.ts
│       └── core/
│           └── CodeEditor.ts
├── vue/
│   └── src/
│       ├── __tests__/
│       │   └── CodeEditor.test.ts
│       └── CodeEditor.vue
└── react/
    └── src/
        ├── __tests__/
        │   └── CodeEditor.test.tsx
        └── CodeEditor.tsx
```

## 测试最佳实践

### 1. 命名规范

- 测试文件: `*.test.ts` 或 `*.spec.ts`
- 性能测试: `*.bench.ts`
- 组件测试: `Component.test.tsx` / `Component.test.ts`

### 2. 测试结构

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('功能模块', () => {
  beforeEach(() => {
    // 每个测试前的设置
  })

  afterEach(() => {
    // 每个测试后的清理
  })

  describe('子功能', () => {
    it('应该做某事', () => {
      // 准备
      const input = 'test'
      
      // 执行
      const result = someFunction(input)
      
      // 断言
      expect(result).toBe('expected')
    })
  })
})
```

### 3. Mock 和 Stub

```typescript
import { vi } from 'vitest'

// Mock 模块
vi.mock('monaco-editor', () => ({
  editor: {
    create: vi.fn(() => ({
      getValue: vi.fn(() => 'test'),
      dispose: vi.fn(),
    })),
  },
}))

// Mock 函数
const mockFn = vi.fn()
mockFn('test')
expect(mockFn).toHaveBeenCalledWith('test')
```

### 4. 异步测试

```typescript
it('应该处理异步操作', async () => {
  const result = await asyncFunction()
  expect(result).toBe('expected')
})

it('应该处理 Promise', () => {
  return asyncFunction().then(result => {
    expect(result).toBe('expected')
  })
})
```

### 5. 错误测试

```typescript
it('应该抛出错误', () => {
  expect(() => {
    throwError()
  }).toThrow('Error message')
})

it('应该拒绝 Promise', async () => {
  await expect(rejectPromise()).rejects.toThrow('Error message')
})
```

## 测试覆盖率

### 查看覆盖率报告

```bash
# 生成 HTML 报告
pnpm -r test:coverage

# 在浏览器中打开
# Windows
start packages/core/coverage/index.html

# macOS
open packages/core/coverage/index.html

# Linux
xdg-open packages/core/coverage/index.html
```

### 覆盖率要求

- **语句覆盖率**: > 80%
- **分支覆盖率**: > 75%
- **函数覆盖率**: > 80%
- **行覆盖率**: > 80%

## CI/CD 集成

### GitHub Actions

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm -r test:coverage
      - uses: codecov/codecov-action@v3
```

## 调试测试

### VSCode 调试配置

创建 `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Vitest Tests",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["test", "--run"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### 命令行调试

```bash
# 使用 Node inspector
node --inspect-brk ./node_modules/.bin/vitest

# 或使用 Vitest 的调试模式
pnpm test --inspect-brk
```

## 常见问题

### 1. Mock 不生效

确保 mock 定义在导入之前：

```typescript
vi.mock('module-name')
import { something } from 'module-name'
```

### 2. 异步测试超时

增加超时时间：

```typescript
it('long test', async () => {
  // ...
}, 10000) // 10 秒超时
```

### 3. 测试隔离问题

使用 beforeEach 和 afterEach 清理状态：

```typescript
beforeEach(() => {
  // 重置状态
})

afterEach(() => {
  // 清理资源
  vi.clearAllMocks()
})
```

## 性能测试最佳实践

### 1. 基准测试

```typescript
import { bench, describe } from 'vitest'

describe('Performance', () => {
  bench('操作名称', () => {
    // 要测试的代码
  })
})
```

### 2. 对比测试

```typescript
bench('方案 A', () => {
  // 实现 A
})

bench('方案 B', () => {
  // 实现 B
})
```

### 3. 性能回归

定期运行性能测试，确保没有性能退化：

```bash
# 保存基准
pnpm test:bench > baseline.txt

# 对比新版本
pnpm test:bench > current.txt
diff baseline.txt current.txt
```

## 资源

- [Vitest 文档](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright](https://playwright.dev/)

---

**最后更新**: 2025-10-29  
**维护者**: LDesign Team
