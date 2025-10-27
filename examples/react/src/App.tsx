import React, { useState, useRef } from 'react'
import { CodeEditor, type CodeEditorRef } from '@ldesign/code-editor-react'
import type { CodeEditor as CoreCodeEditor } from '@ldesign/code-editor-core'
import type * as Monaco from 'monaco-editor'

const initialCode = `// 欢迎使用 LDesign Code Editor React 组件!
// 这是一个功能强大的代码编辑器

import React, { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="counter">
      <h1>Hello React!</h1>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}

export default Counter

// 支持的特性:
// ✓ 受控/非受控组件
// ✓ Hooks 支持
// ✓ 语法高亮
// ✓ 自动补全
// ✓ 代码格式化
// ✓ 多语言支持
// ✓ 主题切换
// ✓ TypeScript 完整类型支持
`

function App() {
  const editorRef = useRef<CodeEditorRef>(null)
  const [code, setCode] = useState(initialCode)
  const [language, setLanguage] = useState('javascript')
  const [theme, setTheme] = useState('vs-dark')
  const [fontSize, setFontSize] = useState(14)
  const [readOnly, setReadOnly] = useState(false)
  const [status, setStatus] = useState('初始化中...')
  const [lineCount, setLineCount] = useState(0)
  const [cursorPos, setCursorPos] = useState('1:1')
  const [selectedText, setSelectedText] = useState('无')

  const onEditorReady = (editor: CoreCodeEditor) => {
    setStatus('就绪')
    updateStats()
    console.log('Editor ready!', editor)
  }

  const onCodeChange = (value: string) => {
    setCode(value)
    updateStats()
    console.log('Code changed:', value.length, 'characters')
  }

  const onCursorChange = (position: Monaco.Position) => {
    setCursorPos(`${position.lineNumber}:${position.column}`)
  }

  const onFocus = () => {
    setStatus('已聚焦')
  }

  const onBlur = () => {
    setStatus('失去焦点')
  }

  const updateStats = () => {
    if (!editorRef.current) return

    const editor = editorRef.current.editor
    if (!editor) return

    const state = editor.getState()
    setLineCount(state.lineCount)

    const selection = editor.getSelection()
    setSelectedText(selection ? `已选中 ${selection.length} 个字符` : '无')
  }

  const handleFormat = async () => {
    await editorRef.current?.format()
    setStatus('代码已格式化')
  }

  const handleGetValue = () => {
    const value = editorRef.current?.getValue()
    console.log('Editor content:', value)
    alert(`内容长度: ${value?.length} 个字符\n(详细内容请查看控制台)`)
  }

  const handleClear = () => {
    if (confirm('确定要清空编辑器内容吗?')) {
      setCode('')
      setStatus('已清空')
    }
  }

  const handleUndo = () => {
    editorRef.current?.undo()
    setStatus('已撤销')
  }

  const handleRedo = () => {
    editorRef.current?.redo()
    setStatus('已重做')
  }

  const toggleReadOnly = () => {
    setReadOnly(!readOnly)
    setStatus(!readOnly ? '只读模式' : '编辑模式')
  }

  return (
    <div className="app">
      <header>
        <h1>🚀 Code Editor - React Example</h1>
      </header>

      <div className="controls">
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="control-select">
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="json">JSON</option>
          <option value="markdown">Markdown</option>
        </select>

        <select value={theme} onChange={(e) => setTheme(e.target.value)} className="control-select">
          <option value="vs-dark">VS Dark</option>
          <option value="vs">VS Light</option>
          <option value="hc-black">High Contrast</option>
        </select>

        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          min="10"
          max="30"
          className="control-input"
          placeholder="Font Size"
        />

        <button onClick={handleFormat} className="control-btn">格式化代码</button>
        <button onClick={handleGetValue} className="control-btn">获取内容</button>
        <button onClick={handleClear} className="control-btn">清空</button>
        <button onClick={handleUndo} className="control-btn">撤销</button>
        <button onClick={handleRedo} className="control-btn">重做</button>
        <button onClick={toggleReadOnly} className="control-btn">
          {readOnly ? '取消只读' : '切换只读'}
        </button>
      </div>

      <div className="editor-wrapper">
        <CodeEditor
          ref={editorRef}
          value={code}
          language={language}
          theme={theme}
          fontSize={fontSize}
          readOnly={readOnly}
          minimap={true}
          folding={true}
          lineNumbers="on"
          autoComplete={true}
          onChange={onCodeChange}
          onReady={onEditorReady}
          onCursorChange={onCursorChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>

      <div className="stats">
        <div><strong>状态:</strong> {status}</div>
        <div><strong>行数:</strong> {lineCount}</div>
        <div><strong>光标位置:</strong> {cursorPos}</div>
        <div><strong>选中文本:</strong> {selectedText}</div>
        <div><strong>代码长度:</strong> {code.length} 字符</div>
      </div>
    </div>
  )
}

export default App

