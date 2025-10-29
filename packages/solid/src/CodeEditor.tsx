import { createEffect, createSignal, onCleanup, onMount, type JSX } from 'solid-js'
import { createCodeEditor, type CodeEditor as CoreCodeEditor, type CodeEditorConfig } from '@ldesign/code-editor-core'
import type { EditorLanguage, EditorTheme } from '@ldesign/code-editor-core'

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
  class?: string
  style?: JSX.CSSProperties
  onChange?: (value: string) => void
  onCursorChange?: (position: any) => void
  onFocus?: () => void
  onBlur?: () => void
  onReady?: (editor: CoreCodeEditor) => void
}

export function CodeEditor(props: CodeEditorProps) {
  let containerRef: HTMLDivElement | undefined
  const [editorInstance, setEditorInstance] = createSignal<CoreCodeEditor | null>(null)
  const [isReady, setIsReady] = createSignal(false)

  onMount(() => {
    if (!containerRef)
      return

    const config: CodeEditorConfig = {
      value: props.value || '',
      language: props.language || 'javascript',
      theme: props.theme || 'vs-dark',
      readOnly: props.readOnly || false,
      autoComplete: props.autoComplete !== false,
      folding: props.folding !== false,
      lineNumbers: props.lineNumbers || 'on',
      minimap: props.minimap !== false,
      fontSize: props.fontSize || 14,
      tabSize: props.tabSize || 2,
      insertSpaces: props.insertSpaces !== false,
      wordWrap: props.wordWrap || 'off',
      on: {
        change: props.onChange,
        cursorChange: props.onCursorChange,
        focus: props.onFocus,
        blur: props.onBlur,
        ready: (editor) => {
          setEditorInstance(editor as any)
          setIsReady(true)
          props.onReady?.(editor as any)
        },
      },
    }

    const editor = createCodeEditor(containerRef, config)
    setEditorInstance(editor)

    onCleanup(() => {
      editor.dispose()
      setEditorInstance(null)
      setIsReady(false)
    })
  })

  // 响应式更新值
  createEffect(() => {
    const editor = editorInstance()
    if (editor && isReady() && props.value !== undefined && props.value !== editor.getValue()) {
      editor.setValue(props.value)
    }
  })

  // 响应式更新语言
  createEffect(() => {
    const editor = editorInstance()
    if (editor && isReady() && props.language) {
      editor.setLanguage(props.language)
    }
  })

  // 响应式更新主题
  createEffect(() => {
    const editor = editorInstance()
    if (editor && isReady() && props.theme) {
      editor.setTheme(props.theme)
    }
  })

  const containerStyle = (): JSX.CSSProperties => ({
    width: typeof props.width === 'number' ? `${props.width}px` : (props.width || '100%'),
    height: typeof props.height === 'number' ? `${props.height}px` : (props.height || '400px'),
    ...props.style,
  })

  return (
    <div
      ref={containerRef}
      class={props.class}
      style={containerStyle()}
    />
  )
}
