import { createEffect, createSignal, onCleanup, type Accessor } from 'solid-js'
import { createCodeEditor as createCoreEditor, type CodeEditor, type CodeEditorConfig } from '@ldesign/code-editor-core'

export interface CreateCodeEditorReturn {
  editorInstance: Accessor<CodeEditor | null>
  isReady: Accessor<boolean>
  getValue: () => string
  setValue: (value: string) => void
  focus: () => void
  format: () => Promise<void>
}

export function createCodeEditor(
  containerRef: Accessor<HTMLElement | undefined>,
  config: Accessor<CodeEditorConfig> = () => ({}),
): CreateCodeEditorReturn {
  const [editorInstance, setEditorInstance] = createSignal<CodeEditor | null>(null)
  const [isReady, setIsReady] = createSignal(false)

  createEffect(() => {
    const container = containerRef()
    if (!container)
      return

    const currentConfig = config()
    const editor = createCoreEditor(container, {
      ...currentConfig,
      on: {
        ...currentConfig.on,
        ready: (editorInstance) => {
          setIsReady(true)
          currentConfig.on?.ready?.(editorInstance)
        },
      },
    })

    setEditorInstance(editor)

    onCleanup(() => {
      editor.dispose()
      setEditorInstance(null)
      setIsReady(false)
    })
  })

  const getValue = (): string => {
    return editorInstance()?.getValue() ?? ''
  }

  const setValue = (value: string): void => {
    editorInstance()?.setValue(value)
  }

  const focus = (): void => {
    editorInstance()?.focus()
  }

  const format = async (): Promise<void> => {
    await editorInstance()?.format()
  }

  return {
    editorInstance,
    isReady,
    getValue,
    setValue,
    focus,
    format,
  }
}
