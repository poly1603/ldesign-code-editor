import { useEffect, useRef, type CSSProperties } from 'react'
import type { CodeEditor as CoreCodeEditor } from '@ldesign/code-editor-core'
import { useCodeEditor } from './useCodeEditor'
import type { CodeEditorConfig, EditorLanguage, EditorTheme } from '@ldesign/code-editor-core'

export interface CodeEditorProps {
  value?: string
  language?: EditorLanguage
  theme?: EditorTheme
  readOnly?: boolean
  autoComplete?: boolean
  folding?: boolean
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval'
  minimap?: boolean
  fontSize?: number
  tabSize?: number
  insertSpaces?: boolean
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded'
  height?: string | number
  width?: string | number
  className?: string
  style?: CSSProperties
  onChange?: (value: string) => void
  onCursorChange?: (position: any) => void
  onFocus?: () => void
  onBlur?: () => void
  onReady?: (editor: CoreCodeEditor) => void
}

export function CodeEditor({
  value = '',
  language = 'javascript',
  theme = 'vs-dark',
  readOnly = false,
  autoComplete = true,
  folding = true,
  lineNumbers = 'on',
  minimap = true,
  fontSize = 14,
  tabSize = 2,
  insertSpaces = true,
  wordWrap = 'off',
  height = '400px',
  width = '100%',
  className = '',
  style = {},
  onChange,
  onCursorChange,
  onFocus,
  onBlur,
  onReady,
}: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorInstanceRef = useRef<CoreCodeEditor | null>(null)

  const config: CodeEditorConfig = {
    value,
    language,
    theme,
    readOnly,
    autoComplete,
    folding,
    lineNumbers,
    minimap,
    fontSize,
    tabSize,
    insertSpaces,
    wordWrap,
    on: {
      change: onChange,
      cursorChange: onCursorChange,
      focus: onFocus,
      blur: onBlur,
      ready: (editor) => {
        editorInstanceRef.current = editor as any
        onReady?.(editor as any)
      },
    },
  }

  const { editorInstance, isReady } = useCodeEditor(containerRef, config)

  useEffect(() => {
    if (editorInstance && isReady && value !== editorInstance.getValue()) {
      editorInstance.setValue(value)
    }
  }, [value, editorInstance, isReady])

  const containerStyle: CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    ...style,
  }

  return <div ref={containerRef} className={className} style={containerStyle} />
}

export default CodeEditor
