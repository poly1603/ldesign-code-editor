import { ref, onMounted, onBeforeUnmount, watch, type Ref } from 'vue'
import { createCodeEditor, type CodeEditor, type CodeEditorConfig } from '@ldesign/code-editor-core'

export interface UseCodeEditorOptions extends Omit<CodeEditorConfig, 'on'> {
  onChange?: (value: string) => void
  onReady?: (editor: CodeEditor) => void
  onFocus?: () => void
  onBlur?: () => void
}

export interface UseCodeEditorReturn {
  editor: Ref<CodeEditor | undefined>
  containerRef: Ref<HTMLElement | undefined>
  isReady: Ref<boolean>
  getValue: () => string
  setValue: (value: string) => void
  focus: () => void
  format: () => Promise<void>
}

/**
 * Vue 3 Composable for code editor
 */
export function useCodeEditor(options: UseCodeEditorOptions = {}): UseCodeEditorReturn {
  const containerRef = ref<HTMLElement>()
  const editor = ref<CodeEditor>()
  const isReady = ref(false)

  // 内部值，防止循环更新
  let internalValue = options.value || ''

  const initializeEditor = () => {
    if (!containerRef.value) return

    try {
      const config: CodeEditorConfig = {
        ...options,
        on: {
          ready: (ed) => {
            isReady.value = true
            if (options.onReady) {
              options.onReady(editor.value!)
            }
          },
          change: (value) => {
            if (value !== internalValue) {
              internalValue = value
              if (options.onChange) {
                options.onChange(value)
              }
            }
          },
          focus: () => {
            if (options.onFocus) {
              options.onFocus()
            }
          },
          blur: () => {
            if (options.onBlur) {
              options.onBlur()
            }
          }
        }
      }

      editor.value = createCodeEditor(containerRef.value, config)
    } catch (error) {
      console.error('Failed to initialize editor:', error)
    }
  }

  const getValue = (): string => {
    return editor.value?.getValue() || ''
  }

  const setValue = (value: string): void => {
    if (editor.value && value !== internalValue) {
      internalValue = value
      editor.value.setValue(value)
    }
  }

  const focus = (): void => {
    editor.value?.focus()
  }

  const format = async (): Promise<void> => {
    await editor.value?.format()
  }

  // 监听 value 变化
  if (options.value !== undefined) {
    watch(() => options.value, (newValue) => {
      if (newValue !== undefined && newValue !== internalValue) {
        setValue(newValue)
      }
    })
  }

  // 监听语言变化
  if (options.language) {
    watch(() => options.language, (newValue) => {
      if (editor.value && newValue) {
        editor.value.setLanguage(newValue as any)
      }
    })
  }

  // 监听主题变化
  if (options.theme) {
    watch(() => options.theme, (newValue) => {
      if (editor.value && newValue) {
        editor.value.setTheme(newValue as any)
      }
    })
  }

  onMounted(() => {
    // 延迟初始化以确保 DOM 已渲染
    setTimeout(initializeEditor, 0)
  })

  onBeforeUnmount(() => {
    if (editor.value) {
      editor.value.dispose()
      editor.value = undefined
    }
  })

  return {
    editor,
    containerRef,
    isReady,
    getValue,
    setValue,
    focus,
    format
  }
}

