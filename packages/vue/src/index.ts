// Components
export { default as CodeEditor } from './components/CodeEditor.vue'
export { default as DiffEditor } from './components/DiffEditor.vue'

// Composables
export { useCodeEditor } from './composables/useCodeEditor'
export { useDiffEditor } from './composables/useDiffEditor'

// Directive
export { vCodeEditor } from './directives/vCodeEditor'

// Re-export core types
export type {
  CodeEditorOptions,
  CodeEditorInstance,
  EditorTheme,
  EditorLanguage,
  EditorEvent,
  EditorEventHandler,
  DiffEditorOptions,
  CompletionProvider,
  HoverProvider,
  FormatProvider
} from '@ldesign/code-editor-core'

// Re-export core utilities
export {
  createEditor,
  destroyEditor,
  defaultThemes,
  registerTheme,
  getTheme,
  defaultLanguages,
  registerLanguage
} from '@ldesign/code-editor-core'

// Plugin install
import type { App } from 'vue'
import CodeEditor from './components/CodeEditor.vue'
import DiffEditor from './components/DiffEditor.vue'
import { vCodeEditor } from './directives/vCodeEditor'

export interface CodeEditorPluginOptions {
  componentPrefix?: string
}

export function install(app: App, options: CodeEditorPluginOptions = {}): void {
  const prefix = options.componentPrefix || ''

  app.component(`${prefix}CodeEditor`, CodeEditor)
  app.component(`${prefix}DiffEditor`, DiffEditor)
  app.directive('code-editor', vCodeEditor)
}

export default {
  install
}
