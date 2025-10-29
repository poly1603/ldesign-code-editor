export { default as CodeEditor } from './CodeEditor.svelte'
export { createCodeEditorStore } from './codeEditorStore'
export type { CodeEditorStore } from './codeEditorStore'

// Re-export core types
export type {
  CodeEditorConfig,
  CodeEditorOptions,
  EditorLanguage,
  EditorTheme,
  ICodeEditor,
} from '@ldesign/code-editor-core'
