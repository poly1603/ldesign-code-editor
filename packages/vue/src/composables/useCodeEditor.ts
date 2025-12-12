import { ref, onMounted, onBeforeUnmount, watch, type Ref } from 'vue'
import type { CodeEditorOptions, CodeEditorInstance } from '@ldesign/code-editor-core'
import { createEditor, destroyEditor } from '@ldesign/code-editor-core'

export interface UseCodeEditorOptions extends Omit<CodeEditorOptions, 'container'> {
  immediate?: boolean
}

export interface UseCodeEditorReturn {
  editor: Ref<CodeEditorInstance | null>
  isReady: Ref<boolean>
  getValue: () => string
  setValue: (value: string) => void
  focus: () => void
  blur: () => void
  format: () => Promise<void>
  undo: () => void
  redo: () => void
  setLanguage: (language: string) => void
  setTheme: (theme: string) => void
  layout: () => void
  destroy: () => void
}

/**
 * Composable for using code editor in Vue components
 */
export function useCodeEditor(
  containerRef: Ref<HTMLElement | null>,
  options: UseCodeEditorOptions = {}
): UseCodeEditorReturn {
  const editor = ref<CodeEditorInstance | null>(null)
  const isReady = ref(false)
  const { immediate = true, ...editorOptions } = options

  const init = () => {
    if (!containerRef.value) {
      console.warn('Container element is not available')
      return
    }

    if (editor.value) {
      destroy()
    }

    editor.value = createEditor({
      container: containerRef.value,
      ...editorOptions
    })
    isReady.value = true
  }

  const destroy = () => {
    if (editor.value) {
      destroyEditor(editor.value)
      editor.value = null
      isReady.value = false
    }
  }

  const getValue = (): string => {
    return editor.value?.getValue() ?? ''
  }

  const setValue = (value: string): void => {
    editor.value?.setValue(value)
  }

  const focus = (): void => {
    editor.value?.focus()
  }

  const blur = (): void => {
    editor.value?.blur()
  }

  const format = async (): Promise<void> => {
    await editor.value?.format()
  }

  const undo = (): void => {
    editor.value?.undo()
  }

  const redo = (): void => {
    editor.value?.redo()
  }

  const setLanguage = (language: string): void => {
    editor.value?.setLanguage(language)
  }

  const setTheme = (theme: string): void => {
    editor.value?.setTheme(theme)
  }

  const layout = (): void => {
    editor.value?.layout()
  }

  // Watch for container changes
  watch(containerRef, (newContainer) => {
    if (newContainer && immediate && !editor.value) {
      init()
    }
  })

  onMounted(() => {
    if (immediate && containerRef.value) {
      init()
    }
  })

  onBeforeUnmount(() => {
    destroy()
  })

  return {
    editor,
    isReady,
    getValue,
    setValue,
    focus,
    blur,
    format,
    undo,
    redo,
    setLanguage,
    setTheme,
    layout,
    destroy
  }
}
