# 贡献指南

感谢您对 @ldesign/code-editor 的关注！

## 🤝 如何贡献

### 报告问题

1. 搜索现有 Issues
2. 使用 Issue 模板
3. 提供详细信息（版本、浏览器、复现步骤）
4. 附上截图或代码

### 提交代码

1. Fork 项目
2. 创建特性分支
3. 编写代码和测试
4. 提交 Pull Request

## 📝 开发流程

### 1. 环境设置

```bash
# Clone 项目
git clone https://github.com/...

# 安装依赖
pnpm install

# 启动开发
pnpm dev
```

### 2. 代码规范

```bash
# 检查代码
pnpm lint

# 格式化
pnpm format

# 类型检查
pnpm type-check
```

### 3. 测试

```bash
# 运行测试
pnpm test

# 测试覆盖率
pnpm test:coverage
```

### 4. 提交规范

使用 Conventional Commits:

```
feat: 添加新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

## 🎯 代码规范

### TypeScript

- 使用严格模式
- 避免 `any` 类型
- 添加 JSDoc 注释
- 导出所有公共 API 类型

### 命名规范

- 类: PascalCase
- 函数: camelCase
- 常量: UPPER_CASE
- 私有成员: 前缀 `_`

### 文件结构

```
src/
├── core/           # 核心功能
├── features/       # 功能模块
├── utils/          # 工具函数
├── types/          # 类型定义
├── components/     # UI 组件
└── adapters/       # 框架适配器
```

## ✅ PR 检查清单

- [ ] 代码通过 ESLint
- [ ] 代码已格式化
- [ ] 添加了测试
- [ ] 测试全部通过
- [ ] 更新了文档
- [ ] 更新了 CHANGELOG
- [ ] 无 TypeScript 错误
- [ ] 无破坏性变更（或已说明）

## 🐛 Bug 报告模板

```markdown
**描述**
简要描述问题

**复现步骤**
1. 
2. 
3. 

**期望行为**
应该...

**实际行为**
但是...

**环境**
- 版本: 
- 浏览器: 
- 操作系统: 

**截图**
如有必要

**额外信息**
其他相关信息
```

## ✨ 功能请求模板

```markdown
**功能描述**
简要描述想要的功能

**使用场景**
什么情况下需要这个功能

**建议实现**
如何实现这个功能

**替代方案**
其他可能的方案

**额外信息**
其他想法
```

## 📚 资源

- [TypeScript 文档](https://www.typescriptlang.org/)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/api/)
- [Vue 3 文档](https://vuejs.org/)
- [Vitest 文档](https://vitest.dev/)

## 💬 联系方式

- GitHub Issues
- Email: ...
- Discord: ...

---

**感谢您的贡献！** 🙏

