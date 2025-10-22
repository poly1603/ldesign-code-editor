# 构建指南

## 🚀 快速构建

### 1. 安装依赖

```bash
pnpm install
```

### 2. 开发模式

```bash
# 启动开发服务器
pnpm dev

# 运行 Vanilla JS 示例
pnpm dev:vanilla

# 运行 Vue 3 示例
pnpm dev:vue

# 运行 React 示例  
pnpm dev:react
```

### 3. 构建生产版本

```bash
# 标准构建
pnpm build

# 严格模式构建（推荐）
pnpm build:strict

# 仅构建类型定义
pnpm build:types
```

### 4. 代码质量检查

```bash
# ESLint 检查
pnpm lint

# 自动修复
pnpm lint --fix

# 代码格式化
pnpm format

# TypeScript 类型检查
pnpm type-check
```

### 5. 测试

```bash
# 运行测试
pnpm test

# 测试 UI
pnpm test:ui

# 测试覆盖率
pnpm test:coverage
```

## 📦 构建输出

构建后会生成以下文件：

```
dist/
├── code-editor.es.js        # ES Module
├── code-editor.umd.js       # UMD Module
├── vue.es.js                # Vue ES Module
├── vue.umd.js               # Vue UMD Module
├── style.css                # 样式文件
├── index.d.ts               # 类型定义
└── vue/
    └── index.d.ts           # Vue 类型定义
```

## 🔧 开发工具

### VSCode 推荐扩展

- ESLint
- Prettier
- Volar (Vue)
- TypeScript Vue Plugin

### 推荐设置

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 📝 发布流程

### 1. 版本更新

```bash
# 更新版本号
npm version patch|minor|major

# 或手动编辑 package.json
```

### 2. 构建检查

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm build:strict
```

### 3. 发布

```bash
pnpm publish
```

## 🐛 故障排除

### 构建失败

```bash
# 清理缓存
rm -rf node_modules dist
pnpm install
pnpm build
```

### 类型错误

```bash
# 检查 TypeScript 配置
pnpm type-check

# 使用严格模式
pnpm build:strict
```

### 测试失败

```bash
# 查看详细日志
pnpm test -- --reporter=verbose

# 运行特定测试
pnpm test tests/unit/core.test.ts
```

## 📊 性能分析

### 构建大小分析

```bash
# 构建后查看
ls -lh dist/

# 预期大小
# code-editor.es.js: ~150KB (gzipped: ~50KB)
# vue.es.js: ~30KB (gzipped: ~10KB)
```

### Bundle 分析

使用 Vite 的分析工具：

```bash
pnpm build -- --report
```

## ✅ 发布前检查清单

- [ ] 所有测试通过
- [ ] 无 ESLint 错误
- [ ] 无 TypeScript 错误
- [ ] 文档已更新
- [ ] CHANGELOG 已更新
- [ ] 版本号已更新
- [ ] 构建成功
- [ ] 示例项目运行正常

## 📚 相关文档

- [快速开始](./QUICK_START_v2.0.md)
- [API 文档](./API_v2.0.md)
- [完成报告](./🎊全部完成报告.md)

---

**最后更新**: 2025-01-22

