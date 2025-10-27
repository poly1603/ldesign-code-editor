# @ldesign/code-editor-vue

Vue 3 组件封装，基于 @ldesign/code-editor-core。

## 安装

```bash
npm install @ldesign/code-editor-vue @ldesign/code-editor-core monaco-editor vue
# 或
pnpm add @ldesign/code-editor-vue @ldesign/code-editor-core monaco-editor vue
```

## 快速开始

### 注册组件

```typescript
import { createApp } from 'vue'
import { CodeEditorPlugin } from '@ldesign/code-editor-vue'
import '@ldesign/code-editor-vue/style.css'

const app = createApp(App)
app.use(CodeEditorPlugin)
```

### 使用组件

```vue
<template>
  <div class="editor-container">
    <CodeEditor
      v-model="code"
      language="javascript"
      theme="vs-dark"
      :line-numbers="'on'"
      :minimap="true"
      :font-size="14"
      @ready="onEditorReady"
      @change="onCodeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CodeEditor } from '@ldesign/code-editor-vue'

const code = ref('console.log("Hello World")')

const onEditorReady = (editor) => {
  console.log('Editor ready:', editor)
}

const onCodeChange = (value) => {
  console.log('Code changed:', value)
}
</script>

<style scoped>
.editor-container {
  width: 100%;
  height: 600px;
}
</style>
```

### 使用 Composable

```vue
<template>
  <div ref="containerRef" class="editor-container"></div>
</template>

<script setup lang="ts">
import { useCodeEditor } from '@ldesign/code-editor-vue'

const { containerRef, editor, isReady, getValue, setValue } = useCodeEditor({
  language: 'javascript',
  theme: 'vs-dark',
  value: 'console.log("Hello")',
  onChange: (value) => {
    console.log('Changed:', value)
  },
  onReady: () => {
    console.log('Editor ready!')
  }
})

// 使用编辑器方法
const handleFormat = async () => {
  await editor.value?.format()
}

const handleGetValue = () => {
  console.log(getValue())
}
</script>
```

## API

### CodeEditor 组件 Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | string | '' | 编辑器内容（v-model） |
| language | string | 'javascript' | 编程语言 |
| theme | string | 'vs-dark' | 主题 |
| readOnly | boolean | false | 只读模式 |
| autoComplete | boolean | true | 自动补全 |
| folding | boolean | true | 代码折叠 |
| lineNumbers | string | 'on' | 行号显示 |
| minimap | boolean | true | 缩略图 |
| fontSize | number | 14 | 字体大小 |
| tabSize | number | 2 | Tab 大小 |
| insertSpaces | boolean | true | 使用空格 |
| wordWrap | string | 'off' | 自动换行 |
| showLoading | boolean | false | 显示加载动画 |
| loadingText | string | '加载编辑器中...' | 加载文本 |
| containerClass | string/array/object | - | 容器类名 |
| options | object | - | Monaco 编辑器额外选项 |

### CodeEditor 组件 Events

- `update:modelValue` - 内容更新
- `change` - 内容改变
- `ready` - 编辑器就绪
- `focus` - 获得焦点
- `blur` - 失去焦点
- `cursorChange` - 光标位置改变

### CodeEditor 组件 Methods

通过 ref 访问组件实例的方法：

- `getValue()` - 获取编辑器内容
- `setValue(value)` - 设置编辑器内容
- `getSelection()` - 获取选中文本
- `setSelection(selection)` - 设置选中区域
- `insertText(text, position?)` - 插入文本
- `format()` - 格式化代码
- `setLanguage(language)` - 设置语言
- `setTheme(theme)` - 设置主题
- `setReadOnly(readOnly)` - 设置只读
- `focus()` - 聚焦编辑器
- `getPosition()` - 获取光标位置
- `setPosition(position)` - 设置光标位置
- `undo()` - 撤销
- `redo()` - 重做
- `getEditor()` - 获取 Monaco 编辑器实例
- `layout(dimension?)` - 重新布局

## 插槽

### loading

自定义加载动画：

```vue
<CodeEditor v-model="code" :show-loading="true">
  <template #loading>
    <div class="custom-loading">加载中...</div>
  </template>
</CodeEditor>
```

## License

MIT

