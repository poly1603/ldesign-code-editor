/**
 * 编辑器布局管理器
 */

import type * as Monaco from 'monaco-editor'

export interface LayoutConfig {
  type: 'single' | 'horizontal' | 'vertical' | 'grid'
  sizes?: number[]
  editors?: Array<{
    id: string
    content: string
    language: string
  }>
}

export interface EditorPane {
  id: string
  editor: Monaco.editor.IStandaloneCodeEditor
  container: HTMLElement
  size: number
}

export class LayoutManager {
  private panes: EditorPane[] = []
  private container: HTMLElement
  private currentLayout: LayoutConfig['type'] = 'single'

  constructor(container: HTMLElement) {
    this.container = container
  }

  setLayout(config: LayoutConfig): void {
    this.currentLayout = config.type
    this.applyLayout(config)
  }

  splitHorizontal(): void {
    this.setLayout({ type: 'horizontal', sizes: [50, 50] })
  }

  splitVertical(): void {
    this.setLayout({ type: 'vertical', sizes: [50, 50] })
  }

  addPane(pane: EditorPane): void {
    this.panes.push(pane)
  }

  removePane(id: string): void {
    const index = this.panes.findIndex((p) => p.id === id)
    if (index !== -1) {
      this.panes[index].editor.dispose()
      this.panes[index].container.remove()
      this.panes.splice(index, 1)
    }
  }

  getPanes(): EditorPane[] {
    return [...this.panes]
  }

  private applyLayout(config: LayoutConfig): void {
    const { type, sizes = [] } = config

    switch (type) {
      case 'horizontal':
        this.applyHorizontalLayout(sizes)
        break
      case 'vertical':
        this.applyVerticalLayout(sizes)
        break
      case 'grid':
        this.applyGridLayout()
        break
      default:
        this.applySingleLayout()
    }
  }

  private applyHorizontalLayout(sizes: number[]): void {
    this.container.style.display = 'flex'
    this.container.style.flexDirection = 'row'
    this.panes.forEach((pane, index) => {
      const size = sizes[index] || 100 / this.panes.length
      pane.container.style.width = `${size}%`
      pane.container.style.height = '100%'
    })
  }

  private applyVerticalLayout(sizes: number[]): void {
    this.container.style.display = 'flex'
    this.container.style.flexDirection = 'column'
    this.panes.forEach((pane, index) => {
      const size = sizes[index] || 100 / this.panes.length
      pane.container.style.height = `${size}%`
      pane.container.style.width = '100%'
    })
  }

  private applyGridLayout(): void {
    this.container.style.display = 'grid'
    this.container.style.gridTemplateColumns = 'repeat(2, 1fr)'
    this.container.style.gridTemplateRows = 'repeat(2, 1fr)'
  }

  private applySingleLayout(): void {
    this.container.style.display = 'block'
    this.panes.forEach((pane) => {
      pane.container.style.width = '100%'
      pane.container.style.height = '100%'
    })
  }

  saveLayout(): LayoutConfig {
    return {
      type: this.currentLayout,
      sizes: this.panes.map((p) => p.size),
      editors: this.panes.map((p) => ({
        id: p.id,
        content: p.editor.getValue(),
        language: p.editor.getModel()?.getLanguageId() || 'javascript',
      })),
    }
  }

  dispose(): void {
    this.panes.forEach((pane) => {
      pane.editor.dispose()
      pane.container.remove()
    })
    this.panes = []
  }
}

