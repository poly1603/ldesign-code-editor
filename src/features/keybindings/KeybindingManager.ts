/**
 * 快捷键管理器
 */

import type * as Monaco from 'monaco-editor'

export interface Keybinding {
  id: string
  key: string
  command: string
  when?: string
  args?: unknown
}

export class KeybindingManager {
  private keybindings = new Map<string, Keybinding>()
  private editor: Monaco.editor.IStandaloneCodeEditor | null = null

  setEditor(editor: Monaco.editor.IStandaloneCodeEditor): void {
    this.editor = editor
  }

  registerKeybinding(keybinding: Keybinding): void {
    this.keybindings.set(keybinding.id, keybinding)

    if (this.editor) {
      const keyCode = this.parseKeyString(keybinding.key)
      this.editor.addCommand(keyCode, () => {
        this.executeCommand(keybinding.command, keybinding.args)
      })
    }
  }

  unregisterKeybinding(id: string): boolean {
    return this.keybindings.delete(id)
  }

  getKeybindings(): Keybinding[] {
    return Array.from(this.keybindings.values())
  }

  detectConflicts(): Array<{ key: string; bindings: Keybinding[] }> {
    const keyMap = new Map<string, Keybinding[]>()

    this.keybindings.forEach((binding) => {
      if (!keyMap.has(binding.key)) {
        keyMap.set(binding.key, [])
      }
      keyMap.get(binding.key)!.push(binding)
    })

    const conflicts: Array<{ key: string; bindings: Keybinding[] }> = []
    keyMap.forEach((bindings, key) => {
      if (bindings.length > 1) {
        conflicts.push({ key, bindings })
      }
    })

    return conflicts
  }

  private parseKeyString(key: string): number {
    // 简化实现，实际需要完整的键盘映射
    const monaco = (globalThis as { monaco?: typeof Monaco }).monaco
    if (!monaco) return 0

    const parts = key.toLowerCase().split('+')
    let keyCode = 0

    parts.forEach((part) => {
      switch (part.trim()) {
        case 'ctrl':
        case 'cmd':
          keyCode |= monaco.KeyMod.CtrlCmd
          break
        case 'shift':
          keyCode |= monaco.KeyMod.Shift
          break
        case 'alt':
          keyCode |= monaco.KeyMod.Alt
          break
      }
    })

    return keyCode
  }

  private executeCommand(command: string, args?: unknown): void {
    this.editor?.trigger('keyboard', command, args)
  }
}

