# @ldesign/code-editor-react

React 组件封装，基于 @ldesign/code-editor-core。

## 安装

```bash
npm install @ldesign/code-editor-react @ldesign/code-editor-core monaco-editor react react-dom
# 或
pnpm add @ldesign/code-editor-react @ldesign/code-editor-core monaco-editor react react-dom
```

## 快速开始

### 使用组件

```tsx
import React, { useRef } from 'react'
import { CodeEditor, type CodeEditorRef } from '@ldesign/code-editor-react'
import '@ldesign/code-editor-react/style.css'

function App() {
  const editorRef = useRef<CodeEditorRef>(null)
  const [code, setCode] = React.useState('console.log("Hello World")')

  const handleChange = (value: string) => {
    setCode(value)
    console.log('Changed:', value)
  }

  const handleReady = (editor) => {
    console.log('Editor ready:', editor)
  }

  const handleFormat = async () => {
    await editorRef.current?.format()
  }

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <CodeEditor
        ref={editorRef}
        value={code}
        language="javascript"
        theme="vs-dark"
        lineNumbers="on"
        minimap={true}
        fontSize={14}
        onChange={handleChange}
        onReady={handleReady}
      />
      <button onClick={handleFormat}>Format Code</button>
    </div>
  )
}
```

### 非受控组件

```tsx
function App() {
  const editorRef = useRef<CodeEditorRef>(null)

  const handleGetValue = () => {
    const value = editorRef.current?.getValue()
    console.log('Current value:', value)
  }

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <CodeEditor
        ref={editorRef}
        defaultValue="const x = 1"
        language="typescript"
        theme="vs-dark"
      />
      <button onClick={handleGetValue}>Get Value</button>
    </div>
  )
}
```

### 使用 Hook

```tsx
import { useCodeEditor } from '@ldesign/code-editor-react'

function App() {
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

  const handleFormat = async () => {
    await editor?.format()
  }

  const handleGetValue = () => {
    console.log(getValue())
  }

  return (
    <div>
      <div ref={containerRef} style={{ width: '100%', height: '600px' }} />
      <button onClick={handleFormat} disabled={!isReady}>Format</button>
      <button onClick={handleGetValue}>Get Value</button>
    </div>
  )
}
```

## API

### CodeEditor 组件 Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | string | - | 受控组件的值 |
| defaultValue | string | '' | 非受控组件的默认值 |
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
| className | string | - | 容器类名 |
| style | CSSProperties | - | 容器样式 |
| options | object | - | Monaco 编辑器额外选项 |
| onChange | function | - | 内容改变回调 |
| onReady | function | - | 编辑器就绪回调 |
| onFocus | function | - | 获得焦点回调 |
| onBlur | function | - | 失去焦点回调 |
| onCursorChange | function | - | 光标位置改变回调 |
| loadingComponent | ReactNode | - | 自定义加载组件 |

### CodeEditor Ref 方法

通过 ref 访问的方法：

```tsx
const editorRef = useRef<CodeEditorRef>(null)

// 方法
editorRef.current?.getValue()           // 获取内容
editorRef.current?.setValue(value)      // 设置内容
editorRef.current?.getSelection()       // 获取选中文本
editorRef.current?.setSelection(range)  // 设置选中区域
editorRef.current?.insertText(text)     // 插入文本
editorRef.current?.format()             // 格式化代码
editorRef.current?.setLanguage(lang)    // 设置语言
editorRef.current?.setTheme(theme)      // 设置主题
editorRef.current?.setReadOnly(ro)      // 设置只读
editorRef.current?.focus()              // 聚焦编辑器
editorRef.current?.getPosition()        // 获取光标位置
editorRef.current?.setPosition(pos)     // 设置光标位置
editorRef.current?.undo()               // 撤销
editorRef.current?.redo()               // 重做
editorRef.current?.getEditor()          // 获取 Monaco 实例
editorRef.current?.layout(dimension)    // 重新布局

// 属性
editorRef.current?.editor               // 获取核心编辑器实例
```

### useCodeEditor Hook

```tsx
const {
  editor,        // 编辑器实例
  containerRef,  // 容器 ref
  isReady,       // 是否就绪
  getValue,      // 获取值
  setValue,      // 设置值
  focus,         // 聚焦
  format        // 格式化
} = useCodeEditor(options)
```

## 自定义加载组件

```tsx
<CodeEditor
  value={code}
  showLoading={true}
  loadingComponent={
    <div style={{ color: 'white' }}>
      <Spinner />
      <p>Loading...</p>
    </div>
  }
/>
```

## TypeScript

完整的 TypeScript 支持，包括所有 props 和 ref 方法的类型定义。

## License

MIT

