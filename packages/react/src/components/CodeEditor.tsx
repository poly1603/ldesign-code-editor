import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef, type CSSProperties } from 'react'
import { createCodeEditor, type CodeEditor as CoreCodeEditor, type CodeEditorConfig } from '@ldesign/code-editor-core'
import type * as Monaco from 'monaco-editor'

export interface CodeEditorProps {
  value?: string
  defaultValue?: string
  language?: string
  theme?: string
  readOnly?: boolean
  autoComplete?: boolean
  folding?: boolean
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval'
  minimap?: boolean
  fontSize?: number
  tabSize?: number
  insertSpaces?: boolean
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded'
  showLoading?: boolean
  loadingText?: string
  options?: Partial<Monaco.editor.IStandaloneEditorConstructionOptions>
  className?: string
  style?: CSSProperties
  onChange?: (value: string) => void
  onReady?: (editor: CoreCodeEditor) => void
  onFocus?: () => void
  onBlur?: () => void
  onCursorChange?: (position: Monaco.Position) => void
  loadingComponent?: React.ReactNode
}

export interface CodeEditorRef {
  editor: CoreCodeEditor | null
  getValue: () => string
  setValue: (value: string) => void
  getSelection: () => string
  setSelection: (selection: Monaco.IRange) => void
  insertText: (text: string, position?: Monaco.IPosition) => void
  format: () => Promise<void>
  setLanguage: (language: string) => void
  setTheme: (theme: string) => void
  setReadOnly: (readOnly: boolean) => void
  focus: () => void
  getPosition: () => Monaco.Position | null
  setPosition: (position: Monaco.IPosition) => void
  undo: () => void
  redo: () => void
  getEditor: () => Monaco.editor.IStandaloneCodeEditor
  layout: (dimension?: Monaco.editor.IDimension) => void
}

const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>((props, ref) => {
  const {
    value,
    defaultValue = '',
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
    showLoading = false,
    loadingText = '加载编辑器中...',
    options,
    className = '',
    style,
    onChange,
    onReady,
    onFocus,
    onBlur,
    onCursorChange,
    loadingComponent
  } = props

  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<CoreCodeEditor | null>(null)
  const [loading, setLoading] = useState(showLoading)

  // 用于受控组件
  const isControlled = value !== undefined
  const internalValueRef = useRef(isControlled ? value : defaultValue)

  useEffect(() => {
    if (!containerRef.current) return

    const initEditor = async () => {
      try {
        setLoading(true)

        const config: CodeEditorConfig = {
          language,
          theme,
          value: isControlled ? value : defaultValue,
          readOnly,
          autoComplete,
          folding,
          lineNumbers,
          minimap,
          fontSize,
          tabSize,
          insertSpaces,
          wordWrap,
          monacoOptions: options,
          on: {
            ready: (ed) => {
              if (onReady) {
                onReady(editorRef.current!)
              }
            },
            change: (newValue) => {
              if (newValue !== internalValueRef.current) {
                internalValueRef.current = newValue
                if (onChange) {
                  onChange(newValue)
                }
              }
            },
            focus: () => {
              if (onFocus) {
                onFocus()
              }
            },
            blur: () => {
              if (onBlur) {
                onBlur()
              }
            },
            cursorChange: (position) => {
              if (onCursorChange) {
                onCursorChange(position)
              }
            }
          }
        }

        editorRef.current = createCodeEditor(containerRef.current, config)

        setTimeout(() => {
          setLoading(false)
        }, 300)
      } catch (error) {
        console.error('Failed to initialize editor:', error)
        setLoading(false)
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

  // 处理受控组件的 value 变化
  useEffect(() => {
    if (isControlled && editorRef.current && value !== internalValueRef.current) {
      internalValueRef.current = value!
      editorRef.current.setValue(value!)
    }
  }, [value, isControlled])

  // 处理其他 props 变化
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setLanguage(language as any)
    }
  }, [language])

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setTheme(theme as any)
    }
  }, [theme])

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setReadOnly(readOnly)
    }
  }, [readOnly])

  useEffect(() => {
    if (editorRef.current && fontSize) {
      editorRef.current.updateOptions({ fontSize })
    }
  }, [fontSize])

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    get editor() {
      return editorRef.current
    },
    getValue: () => editorRef.current?.getValue() || '',
    setValue: (val: string) => {
      if (editorRef.current) {
        internalValueRef.current = val
        editorRef.current.setValue(val)
      }
    },
    getSelection: () => editorRef.current?.getSelection() || '',
    setSelection: (selection: Monaco.IRange) => editorRef.current?.setSelection(selection),
    insertText: (text: string, position?: Monaco.IPosition) => editorRef.current?.insertText(text, position),
    format: async () => await editorRef.current?.format(),
    setLanguage: (lang: string) => editorRef.current?.setLanguage(lang as any),
    setTheme: (t: string) => editorRef.current?.setTheme(t as any),
    setReadOnly: (ro: boolean) => editorRef.current?.setReadOnly(ro),
    focus: () => editorRef.current?.focus(),
    getPosition: () => editorRef.current?.getPosition() || null,
    setPosition: (position: Monaco.IPosition) => editorRef.current?.setPosition(position),
    undo: () => editorRef.current?.undo(),
    redo: () => editorRef.current?.redo(),
    getEditor: () => editorRef.current!.getEditor(),
    layout: (dimension?: Monaco.editor.IDimension) => editorRef.current?.layout(dimension)
  }))

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: '200px',
    overflow: 'hidden',
    ...style
  }

  const loadingStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(30, 30, 30, 0.95)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    transition: 'opacity 0.3s ease'
  }

  const spinnerStyle: CSSProperties = {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255, 255, 255, 0.1)',
    borderTopColor: '#667eea',
    borderRadius: '50%',
    animation: 'ldesign-spin 0.8s linear infinite'
  }

  const textStyle: CSSProperties = {
    marginTop: '20px',
    color: '#fff',
    fontSize: '14px'
  }

  return (
    <div ref={containerRef} className={`ldesign-code-editor ${className}`} style={containerStyle}>
      {loading && (
        <div className="ldesign-code-editor__loading" style={loadingStyle}>
          {loadingComponent || (
            <>
              <div className="ldesign-code-editor__spinner" style={spinnerStyle}></div>
              <div className="ldesign-code-editor__loading-text" style={textStyle}>{loadingText}</div>
            </>
          )}
        </div>
      )}
      <style>{`
        @keyframes ldesign-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
})

CodeEditor.displayName = 'CodeEditor'

export default CodeEditor

