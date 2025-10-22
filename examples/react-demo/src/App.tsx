import { useEffect, useRef, useState } from 'react'
import { createEnhancedCodeEditor } from '@ldesign/code-editor'
import type { ICodeEditor } from '@ldesign/code-editor'
import './App.css'

function App() {
  const editorRef = useRef<HTMLDivElement>(null)
  const [editor, setEditor] = useState<ICodeEditor | null>(null)
  const [code, setCode] = useState('// React Demo\nconsole.log("Hello from React!")')

  useEffect(() => {
    if (!editorRef.current) return

    const editorInstance = createEnhancedCodeEditor(editorRef.current, {
      value: code,
      language: 'javascript',
      theme: 'vs-dark',
      showLoading: true,
      on: {
        change: (value) => setCode(value),
      },
    })

    setEditor(editorInstance)

    return () => {
      editorInstance.dispose()
    }
  }, [])

  return (
    <div className="app">
      <h1>Code Editor - React Demo</h1>
      <div ref={editorRef} style={{ height: '400px', border: '1px solid #ccc' }} />
      <div className="controls">
        <button onClick={() => editor?.format()}>Format</button>
        <button onClick={() => alert(editor?.getValue())}>Get Value</button>
      </div>
    </div>
  )
}

export default App

