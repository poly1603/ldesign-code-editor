<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { createCodeEditor, type CodeEditor as CoreCodeEditor } from '@ldesign/code-editor-core'
  import type { EditorLanguage, EditorTheme, CodeEditorConfig } from '@ldesign/code-editor-core'

  // Props
  export let value: string = ''
  export let language: EditorLanguage = 'javascript'
  export let theme: EditorTheme = 'vs-dark'
  export let readOnly: boolean = false
  export let autoComplete: boolean = true
  export let folding: boolean = true
  export let lineNumbers: 'on' | 'off' | 'relative' | 'interval' = 'on'
  export let minimap: boolean = true
  export let fontSize: number = 14
  export let tabSize: number = 2
  export let insertSpaces: boolean = true
  export let wordWrap: 'on' | 'off' | 'wordWrapColumn' | 'bounded' = 'off'
  export let height: string | number = '400px'
  export let width: string | number = '100%'
  export let customClass: string = ''
  export let customStyle: string = ''

  // 事件
  export let onChange: ((value: string) => void) | undefined = undefined
  export let onCursorChange: ((position: any) => void) | undefined = undefined
  export let onFocus: (() => void) | undefined = undefined
  export let onBlur: (() => void) | undefined = undefined
  export let onReady: ((editor: CoreCodeEditor) => void) | undefined = undefined

  let containerRef: HTMLDivElement
  let editorInstance: CoreCodeEditor | null = null
  let isReady = false

  onMount(() => {
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
          editorInstance = editor as any
          isReady = true
          onReady?.(editor as any)
        },
      },
    }

    editorInstance = createCodeEditor(containerRef, config)
  })

  onDestroy(() => {
    if (editorInstance) {
      editorInstance.dispose()
      editorInstance = null
      isReady = false
    }
  })

  // 响应式更新值
  $: if (editorInstance && isReady && value !== editorInstance.getValue()) {
    editorInstance.setValue(value)
  }

  // 响应式更新语言
  $: if (editorInstance && isReady && language) {
    editorInstance.setLanguage(language)
  }

  // 响应式更新主题
  $: if (editorInstance && isReady && theme) {
    editorInstance.setTheme(theme)
  }

  // 导出方法供外部调用
  export function getValue(): string {
    return editorInstance?.getValue() ?? ''
  }

  export function setValue(newValue: string): void {
    editorInstance?.setValue(newValue)
  }

  export function focus(): void {
    editorInstance?.focus()
  }

  export async function format(): Promise<void> {
    await editorInstance?.format()
  }

  export function getEditor(): CoreCodeEditor | null {
    return editorInstance
  }

  // 计算样式
  const heightStyle = typeof height === 'number' ? `${height}px` : height
  const widthStyle = typeof width === 'number' ? `${width}px` : width
</script>

<div
  bind:this={containerRef}
  class={customClass}
  style="width: {widthStyle}; height: {heightStyle}; {customStyle}"
/>
