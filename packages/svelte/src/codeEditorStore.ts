import { writable, derived, type Readable } from 'svelte/store'
import type { CodeEditor } from '@ldesign/code-editor-core'

export interface CodeEditorStore {
  editor: Readable<CodeEditor | null>
  isReady: Readable<boolean>
  value: Readable<string>
  setEditor: (editor: CodeEditor | null) => void
  setReady: (ready: boolean) => void
  updateValue: (value: string) => void
}

export function createCodeEditorStore(): CodeEditorStore {
  const editorStore = writable<CodeEditor | null>(null)
  const isReadyStore = writable(false)
  const valueStore = writable('')

  const value = derived(
    [editorStore, valueStore],
    ([$editor, $value]) => $editor?.getValue() ?? $value,
  )

  return {
    editor: { subscribe: editorStore.subscribe },
    isReady: { subscribe: isReadyStore.subscribe },
    value,
    setEditor: (editor) => editorStore.set(editor),
    setReady: (ready) => isReadyStore.set(ready),
    updateValue: (newValue) => valueStore.set(newValue),
  }
}
