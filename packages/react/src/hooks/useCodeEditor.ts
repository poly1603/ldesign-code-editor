import { useRef, useEffect, useState, useCallback } from 'react'
import { createCodeEditor, type CodeEditor, type CodeEditorConfig } from '@ldesign/code-editor-core'

export interface UseCodeEditorOptions extends Omit<CodeEditorConfig, 'on'> {
  onChange?: (value: string) => void
  onReady?: (editor: CodeEditor) => void
  onFocus?: () => void
  onBlur?: () => void
}

export interface UseCodeEditorReturn {
  editor: CodeEditor | null
  containerRef: React.RefObject<HTMLDivElement>
  isReady: boolean
  getValue: () => string
  setValue: (value: string) => void
  focus: () => void
  format: () => Promise<void>
}

/**
 * React Hook for code editor
 */
export function useCodeEditor(options: UseCodeEditorOptions = {}): UseCodeEditorReturn {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<CodeEditor | null>(null)
  const [isReady, setIsReady] = useState(false)

  // 内部值，防止循环更新
  const internalValueRef = useRef(options.value || '')

  useEffect(() => {
    if (!containerRef.current) return

    const initEditor = async () => {
      try {
        const config: CodeEditorConfig = {
          ...options,
          on: {
            ready: () => {
              setIsReady(true)
              if (options.onReady && editorRef.current) {
                options.onReady(editorRef.current)
              }
            },
            change: (value) => {
              if (value !== internalValueRef.current) {
                internalValueRef.current = value
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

        editorRef.current = createCodeEditor(containerRef.current, config)
      } catch (error) {
        console.error('Failed to initialize editor:', error)
      }
    }

    initEditor()

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose()
        editorRef.current = null
      }
    }
  }, []) // 只在挂载时初始化

  // 处理 value 变化
  useEffect(() => {
    if (options.value !== undefined && editorRef.current && options.value !== internalValueRef.current) {
      internalValueRef.current = options.value
      editorRef.current.setValue(options.value)
    }
  }, [options.value])

  // 处理语言变化
  useEffect(() => {
    if (options.language && editorRef.current) {
      editorRef.current.setLanguage(options.language as any)
    }
  }, [options.language])

  // 处理主题变化
  useEffect(() => {
    if (options.theme && editorRef.current) {
      editorRef.current.setTheme(options.theme as any)
    }
  }, [options.theme])

  const getValue = useCallback((): string => {
    return editorRef.current?.getValue() || ''
  }, [])

  const setValue = useCallback((value: string): void => {
    if (editorRef.current && value !== internalValueRef.current) {
      internalValueRef.current = value
      editorRef.current.setValue(value)
    }
  }, [])

  const focus = useCallback((): void => {
    editorRef.current?.focus()
  }, [])

  const format = useCallback(async (): Promise<void> => {
    await editorRef.current?.format()
  }, [])

  return {
    editor: editorRef.current,
    containerRef,
    isReady,
    getValue,
    setValue,
    focus,
    format
  }
}

