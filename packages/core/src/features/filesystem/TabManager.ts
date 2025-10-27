/**
 * 标签页管理器
 */

import type { TabInfo, FileNode } from '../../types/filesystem'

export class TabManager {
  private tabs: TabInfo[] = []
  private activeTabId: string | null = null
  private callbacks = new Set<(tabs: TabInfo[]) => void>()

  openTab(file: FileNode, content: string): TabInfo {
    const existing = this.tabs.find((t) => t.file.path === file.path)
    if (existing) {
      this.setActiveTab(existing.id)
      return existing
    }

    const tab: TabInfo = {
      id: this.generateId(),
      file,
      active: true,
      dirty: false,
      content,
    }

    this.tabs.forEach((t) => (t.active = false))
    this.tabs.push(tab)
    this.activeTabId = tab.id
    this.notifyChange()
    return tab
  }

  closeTab(tabId: string): void {
    const index = this.tabs.findIndex((t) => t.id === tabId)
    if (index !== -1) {
      this.tabs.splice(index, 1)
      if (this.activeTabId === tabId && this.tabs.length > 0) {
        this.setActiveTab(this.tabs[Math.max(0, index - 1)].id)
      }
      this.notifyChange()
    }
  }

  setActiveTab(tabId: string): void {
    this.tabs.forEach((t) => (t.active = t.id === tabId))
    this.activeTabId = tabId
    this.notifyChange()
  }

  getActiveTab(): TabInfo | null {
    return this.tabs.find((t) => t.active) || null
  }

  getAllTabs(): TabInfo[] {
    return [...this.tabs]
  }

  markDirty(tabId: string, dirty = true): void {
    const tab = this.tabs.find((t) => t.id === tabId)
    if (tab) {
      tab.dirty = dirty
      this.notifyChange()
    }
  }

  onChange(callback: (tabs: TabInfo[]) => void): () => void {
    this.callbacks.add(callback)
    return () => this.callbacks.delete(callback)
  }

  private notifyChange(): void {
    this.callbacks.forEach((cb) => cb(this.tabs))
  }

  private generateId(): string {
    return `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

