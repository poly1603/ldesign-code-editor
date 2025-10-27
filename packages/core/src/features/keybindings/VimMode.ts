/**
 * Vim 模式
 */

import type * as Monaco from 'monaco-editor'

export class VimMode {
  private editor: Monaco.editor.IStandaloneCodeEditor | null = null
  private mode: 'normal' | 'insert' | 'visual' = 'normal'
  private enabled = false

  setEditor(editor: Monaco.editor.IStandaloneCodeEditor): void {
    this.editor = editor
  }

  enable(): void {
    if (this.enabled) return
    this.enabled = true
    this.mode = 'normal'
    this.setupVimBindings()
  }

  disable(): void {
    this.enabled = false
    this.mode = 'insert'
  }

  getMode(): string {
    return this.mode
  }

  private setupVimBindings(): void {
    if (!this.editor) return

    const monaco = (globalThis as { monaco?: typeof Monaco }).monaco
    if (!monaco) return

    // Normal mode bindings
    this.editor.addCommand(monaco.KeyCode.KeyH, () => {
      if (this.mode === 'normal') {
        this.editor?.trigger('vim', 'cursorLeft', null)
      }
    })

    this.editor.addCommand(monaco.KeyCode.KeyJ, () => {
      if (this.mode === 'normal') {
        this.editor?.trigger('vim', 'cursorDown', null)
      }
    })

    this.editor.addCommand(monaco.KeyCode.KeyK, () => {
      if (this.mode === 'normal') {
        this.editor?.trigger('vim', 'cursorUp', null)
      }
    })

    this.editor.addCommand(monaco.KeyCode.KeyL, () => {
      if (this.mode === 'normal') {
        this.editor?.trigger('vim', 'cursorRight', null)
      }
    })

    this.editor.addCommand(monaco.KeyCode.KeyI, () => {
      if (this.mode === 'normal') {
        this.mode = 'insert'
      }
    })

    this.editor.addCommand(monaco.KeyCode.Escape, () => {
      this.mode = 'normal'
    })
  }
}

