import { ref, onMounted, onBeforeUnmount, watch, type Ref } from 'vue'
import * as monaco from 'monaco-editor'

export interface UseDiffEditorOptions {
  original?: string
  modified?: string
  language?: string
  theme?: string
  readOnly?: boolean
  renderSideBySide?: boolean
  immediate?: boolean
}

export interface UseDiffEditorReturn {
  editor: Ref<monaco.editor.IStandaloneDiffEditor | null>
  isReady: Ref<boolean>
  getOriginalValue: () => string
  getModifiedValue: () => string
  setOriginalValue: (value: string) => void
  setModifiedValue: (value: string) => void
  setLanguage: (language: string) => void
  setTheme: (theme: string) => void
  layout: () => void
  destroy: () => void
}

/**
 * Composable for using diff editor in Vue components
 */
export function useDiffEditor(
  containerRef: Ref<HTMLElement | null>,
  options: UseDiffEditorOptions = {}
): UseDiffEditorReturn {
  const editor = ref<monaco.editor.IStandaloneDiffEditor | null>(null)
  const isReady = ref(false)

  let originalModel: monaco.editor.ITextModel | null = null
  let modifiedModel: monaco.editor.ITextModel | null = null

  const { immediate = true, ...editorOptions } = options

  const init = () => {
    if (!containerRef.value) {
      console.warn('Container element is not available')
      return
    }

    if (editor.value) {
      destroy()
    }

    originalModel = monaco.editor.createModel(
      editorOptions.original || '',
      editorOptions.language || 'plaintext'
    )
    modifiedModel = monaco.editor.createModel(
      editorOptions.modified || '',
      editorOptions.language || 'plaintext'
    )

    editor.value = monaco.editor.createDiffEditor(containerRef.value, {
      theme: editorOptions.theme || 'vs',
      readOnly: editorOptions.readOnly || false,
      renderSideBySide: editorOptions.renderSideBySide !== false,
      automaticLayout: true
    })

    editor.value.setModel({
      original: originalModel,
      modified: modifiedModel
    })

    isReady.value = true
  }

  const destroy = () => {
    editor.value?.dispose()
    originalModel?.dispose()
    modifiedModel?.dispose()
    editor.value = null
    originalModel = null
    modifiedModel = null
    isReady.value = false
  }

  const getOriginalValue = (): string => {
    return originalModel?.getValue() ?? ''
  }

  const getModifiedValue = (): string => {
    return modifiedModel?.getValue() ?? ''
  }

  const setOriginalValue = (value: string): void => {
    originalModel?.setValue(value)
  }

  const setModifiedValue = (value: string): void => {
    modifiedModel?.setValue(value)
  }

  const setLanguage = (language: string): void => {
    if (originalModel) monaco.editor.setModelLanguage(originalModel, language)
    if (modifiedModel) monaco.editor.setModelLanguage(modifiedModel, language)
  }

  const setTheme = (theme: string): void => {
    monaco.editor.setTheme(theme)
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
    getOriginalValue,
    getModifiedValue,
    setOriginalValue,
    setModifiedValue,
    setLanguage,
    setTheme,
    layout,
    destroy
  }
}
