import { useEffect, useRef, useState, type RefObject } from 'react'
import { createCodeEditor, type CodeEditor, type CodeEditorConfig } from '@ldesign/code-editor-core'

export interface UseCodeEditorReturn {
  editorInstance: CodeEditor | null
  isReady: boolean
  getValue: () => string
  setValue: (value: string) => void
  focus: () => void
  format: () => Promise<void>
}

export function useCodeEditor(
  containerRef: RefObject<HTMLElement>,
  config: CodeEditorConfig = {},
): UseCodeEditorReturn {
  const [isReady, setIsReady] = useState(false)
  const editorRef = useRef<CodeEditor | null>(null)

  useEffect(() => {
    if (!containerRef.current)
      return

    // Create editor instance
    const editor = createCodeEditor(containerRef.current, {
      ...config,
      on: {
        ...config.on,
        ready: (editorInstance) => {
          setIsReady(true)
          config.on?.ready?.(editorInstance)
        },
      },
    })

    editorRef.current = editor

    // Cleanup on unmount
    return () => {
      editor.dispose()
      editorRef.current = null
      setIsReady(false)
    }
  }, [containerRef])

  const getValue = () => {
    return editorRef.current?.getValue() ?? ''
  }

  const setValue = (value: string) => {
    editorRef.current?.setValue(value)
  }

  const focus = () => {
    editorRef.current?.focus()
  }

  const format = async () => {
    await editorRef.current?.format()
  }

  return {
    editorInstance: editorRef.current,
    isReady,
    getValue,
    setValue,
    focus,
    format,
  }
}
