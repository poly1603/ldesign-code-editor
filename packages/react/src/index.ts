// 导出组件
export { default as CodeEditor } from './components/CodeEditor'
export type { CodeEditorProps, CodeEditorRef } from './components/CodeEditor'

// 导出 Hook
export { useCodeEditor } from './hooks/useCodeEditor'
export type { UseCodeEditorOptions, UseCodeEditorReturn } from './hooks/useCodeEditor'

// 重新导出核心包的类型和功能
export * from '@ldesign/code-editor-core'

