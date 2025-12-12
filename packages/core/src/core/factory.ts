import { CodeEditor } from './editor'
import type { CodeEditorOptions, CodeEditorInstance } from '../types'

// Store editor instances for cleanup
const editorInstances = new Map<HTMLElement, CodeEditorInstance>()

/**
 * Create a new code editor instance
 */
export function createEditor(options: CodeEditorOptions): CodeEditorInstance {
  const container = typeof options.container === 'string'
    ? document.querySelector(options.container) as HTMLElement
    : options.container

  if (!container) {
    throw new Error('Invalid container element')
  }

  // Destroy existing editor if present
  const existing = editorInstances.get(container)
  if (existing) {
    existing.dispose()
    editorInstances.delete(container)
  }

  const editor = new CodeEditor(options)
  editorInstances.set(container, editor)

  return editor
}

/**
 * Destroy an editor instance
 */
export function destroyEditor(containerOrEditor: HTMLElement | string | CodeEditorInstance): void {
  if (typeof containerOrEditor === 'object' && 'dispose' in containerOrEditor) {
    // It's an editor instance
    containerOrEditor.dispose()
    // Find and remove from map
    for (const [container, editor] of editorInstances) {
      if (editor === containerOrEditor) {
        editorInstances.delete(container)
        break
      }
    }
  } else {
    // It's a container element or selector
    const container = typeof containerOrEditor === 'string'
      ? document.querySelector(containerOrEditor) as HTMLElement
      : containerOrEditor

    if (container) {
      const editor = editorInstances.get(container)
      if (editor) {
        editor.dispose()
        editorInstances.delete(container)
      }
    }
  }
}

/**
 * Get editor instance by container
 */
export function getEditorByContainer(container: HTMLElement | string): CodeEditorInstance | undefined {
  const el = typeof container === 'string'
    ? document.querySelector(container) as HTMLElement
    : container

  return el ? editorInstances.get(el) : undefined
}

/**
 * Get all editor instances
 */
export function getAllEditors(): CodeEditorInstance[] {
  return Array.from(editorInstances.values())
}

/**
 * Destroy all editor instances
 */
export function destroyAllEditors(): void {
  for (const editor of editorInstances.values()) {
    editor.dispose()
  }
  editorInstances.clear()
}
