// 导出组件
import CodeEditor from './components/CodeEditor.vue'

export { CodeEditor }
export default CodeEditor

// 导出 Composable
export { useCodeEditor } from './composables/useCodeEditor'
export type { UseCodeEditorOptions, UseCodeEditorReturn } from './composables/useCodeEditor'

// 重新导出核心包的类型和功能
export * from '@ldesign/code-editor-core'

// Vue 插件安装
import type { App } from 'vue'

export const install = (app: App): void => {
  app.component('CodeEditor', CodeEditor)
  app.component('LCodeEditor', CodeEditor)
}

// 支持 Vue.use()
export const CodeEditorPlugin = {
  install
}

