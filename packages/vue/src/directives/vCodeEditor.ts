import type { Directive, DirectiveBinding } from 'vue'
import type { CodeEditorOptions, CodeEditorInstance } from '@ldesign/code-editor-core'
import { createEditor, destroyEditor } from '@ldesign/code-editor-core'

export interface CodeEditorDirectiveOptions extends Omit<CodeEditorOptions, 'container'> {
  onReady?: (editor: CodeEditorInstance) => void
  onChange?: (value: string) => void
  onSave?: (value: string) => void
}

// Store editor instances by element
const editorMap = new WeakMap<HTMLElement, CodeEditorInstance>()

/**
 * Vue directive for creating code editor
 * 
 * Usage:
 * ```vue
 * <div v-code-editor="options"></div>
 * ```
 * 
 * Or with modifiers:
 * ```vue
 * <div v-code-editor.readonly="{ value: code, language: 'typescript' }"></div>
 * ```
 */
export const vCodeEditor: Directive<HTMLElement, CodeEditorDirectiveOptions> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<CodeEditorDirectiveOptions>) {
    const options = binding.value || {}
    const modifiers = binding.modifiers

    // Apply modifiers
    const editorOptions: CodeEditorOptions = {
      container: el,
      readOnly: modifiers.readonly || options.readOnly,
      ...options
    }

    const editor = createEditor(editorOptions)
    editorMap.set(el, editor)

    // Setup callbacks
    if (options.onReady) {
      options.onReady(editor)
    }

    if (options.onChange) {
      editor.on('change', options.onChange)
    }

    if (options.onSave) {
      editor.on('save', options.onSave)
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding<CodeEditorDirectiveOptions>) {
    const editor = editorMap.get(el)
    if (!editor) return

    const options = binding.value || {}
    const oldOptions = binding.oldValue || {}

    // Skip if same reference (no actual change)
    if (options === oldOptions) return

    // Update value if changed (compare with editor's current value to avoid loops)
    if (options.value !== undefined) {
      const currentValue = editor.getValue()
      if (options.value !== currentValue) {
        editor.setValue(options.value)
      }
    }

    // Update language if changed
    if (options.language !== undefined && options.language !== oldOptions?.language) {
      editor.setLanguage(options.language)
    }

    // Update theme if changed
    if (options.theme !== undefined && options.theme !== oldOptions?.theme) {
      editor.setTheme(options.theme)
    }

    // Only update options if specific properties changed
    const hasOptionsChanged =
      options.readOnly !== oldOptions?.readOnly ||
      options.lineNumbers !== oldOptions?.lineNumbers ||
      options.minimap !== oldOptions?.minimap ||
      options.wordWrap !== oldOptions?.wordWrap ||
      options.fontSize !== oldOptions?.fontSize ||
      options.tabSize !== oldOptions?.tabSize

    if (hasOptionsChanged) {
      editor.updateOptions({
        readOnly: binding.modifiers.readonly || options.readOnly,
        lineNumbers: options.lineNumbers,
        minimap: options.minimap,
        wordWrap: options.wordWrap,
        fontSize: options.fontSize,
        tabSize: options.tabSize
      })
    }
  },

  beforeUnmount(el: HTMLElement) {
    const editor = editorMap.get(el)
    if (editor) {
      destroyEditor(editor)
      editorMap.delete(el)
    }
  }
}

/**
 * Get editor instance from element
 */
export function getEditorFromElement(el: HTMLElement): CodeEditorInstance | undefined {
  return editorMap.get(el)
}
