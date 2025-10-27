# TypeScript 错误快速修复指南

## 问题分类和解决方案

### 1. 更新 tsconfig.json（所有包）

在 `packages/core/tsconfig.json`, `packages/vue/tsconfig.json`, `packages/react/tsconfig.json` 中添加：

```json
{
  "compilerOptions": {
    // ... 其他配置
    "lib": ["ES2021", "DOM", "DOM.Iterable"],  // 添加 ES2021 支持 FinalizationRegistry
    "noUncheckedIndexedAccess": false  // 暂时关闭，或者添加所有数组访问检查
  }
}
```

### 2. 修复未使用的变量

**选项 A: 使用下划线前缀**
```typescript
// 改为
function example(_unusedParam: string) {
  // ...
}
```

**选项 B: 使用 @ts-ignore**
```typescript
// @ts-ignore - parameter required by interface
function example(requiredByInterface: string) {
  // ...
}
```

### 3. 修复数组/对象可能为 undefined

```typescript
// 修复前
const item = array[index]
item.property

// 修复后
const item = array[index]
if (item) {
  item.property
}

// 或使用可选链
array[index]?.property

// 或使用非空断言（确保不为空时）
array[index]!.property
```

### 4. 修复正则匹配结果

```typescript
// 修复前
const match = text.match(/pattern/)
someArray.push(match[1])

// 修复后
const match = text.match(/pattern/)
if (match?.[1]) {
  someArray.push(match[1])
}
```

### 5. 修复 Monaco Editor API

在所有语言服务文件中：

```typescript
// 修复前
provideCompletionItems: () => {
  return {
    suggestions: [
      {
        label: 'function',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'function ${1:name}() {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Function declaration'
      }
    ]
  }
}

// 修复后
provideCompletionItems: (model, position) => {
  const word = model.getWordUntilPosition(position)
  const range = {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    endColumn: word.endColumn
  }
  
  return {
    suggestions: [
      {
        label: 'function',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'function ${1:name}() {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Function declaration',
        range: range  // 添加 range
      }
    ]
  }
}
```

## 批量修复脚本

创建 `fix-types.sh` (Linux/Mac) 或 `fix-types.ps1` (Windows):

```bash
#!/bin/bash

# 更新所有 tsconfig.json
for file in packages/*/tsconfig.json; do
  # 使用 jq 或手动编辑添加 ES2021 到 lib
  echo "Update $file manually to include ES2021 in lib"
done

# 添加必要的 null 检查
# 这需要手动完成或使用代码转换工具
```

## 推荐修复顺序

1. **首先**: 更新所有 `tsconfig.json` 文件
2. **然后**: 修复 Monaco Editor API 类型错误（最重要）
3. **接着**: 添加数组/对象访问的 null 检查
4. **最后**: 移除或重命名未使用的变量

## 临时解决方案（快速启动）

如果需要快速让项目运行起来，可以在各包的 `tsconfig.json` 中临时添加：

```json
{
  "compilerOptions": {
    "strict": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noUncheckedIndexedAccess": false
  }
}
```

⚠️ **注意**: 这只是临时方案，建议后续正确修复所有类型错误。

## 验证修复

修复后运行：

```bash
# 类型检查
cd packages/core
pnpm type-check

# 构建
pnpm build

# 测试
pnpm test
```

## 需要修复的主要文件

1. `src/core/EditorPool.ts` - 2 个错误
2. `src/core/MemoryManager.ts` - 3 个错误
3. `src/features/ai/*.ts` - 20+ 个错误
4. `src/languages/*/*.ts` - 8 个错误
5. 其他特性文件 - 18 个错误

总计约 51 个错误需要修复。

