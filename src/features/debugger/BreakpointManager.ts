/**
 * 断点管理器
 */

import type { Breakpoint } from '../../types/debugger'
import type * as Monaco from 'monaco-editor'

export class BreakpointManager {
  private breakpoints = new Map<number, Breakpoint>()
  private decorations: string[] = []
  private editor: Monaco.editor.IStandaloneCodeEditor | null = null

  setEditor(editor: Monaco.editor.IStandaloneCodeEditor): void {
    this.editor = editor
    this.renderBreakpoints()
  }

  addBreakpoint(line: number, condition?: string): Breakpoint {
    const bp: Breakpoint = {
      id: `bp-${Date.now()}`,
      line,
      enabled: true,
      condition,
      hitCount: 0,
    }
    this.breakpoints.set(line, bp)
    this.renderBreakpoints()
    return bp
  }

  removeBreakpoint(line: number): void {
    this.breakpoints.delete(line)
    this.renderBreakpoints()
  }

  toggleBreakpoint(line: number): void {
    if (this.breakpoints.has(line)) {
      this.removeBreakpoint(line)
    } else {
      this.addBreakpoint(line)
    }
  }

  enableBreakpoint(line: number, enabled = true): void {
    const bp = this.breakpoints.get(line)
    if (bp) {
      bp.enabled = enabled
      this.renderBreakpoints()
    }
  }

  getBreakpoints(): Breakpoint[] {
    return Array.from(this.breakpoints.values())
  }

  clearAll(): void {
    this.breakpoints.clear()
    this.renderBreakpoints()
  }

  private renderBreakpoints(): void {
    if (!this.editor) return

    const monaco = (globalThis as { monaco?: typeof Monaco }).monaco
    if (!monaco) return

    const newDecorations = Array.from(this.breakpoints.values()).map((bp) => ({
      range: new monaco.Range(bp.line, 1, bp.line, 1),
      options: {
        isWholeLine: true,
        className: bp.enabled ? 'breakpoint-line' : 'breakpoint-disabled-line',
        glyphMarginClassName: bp.enabled ? 'breakpoint-glyph' : 'breakpoint-disabled-glyph',
      },
    }))

    this.decorations = this.editor.deltaDecorations(this.decorations, newDecorations)
  }
}

