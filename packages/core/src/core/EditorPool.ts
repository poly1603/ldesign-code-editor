/**
 * 编辑器实例池
 * 复用编辑器实例以优化性能和内存
 */

import type * as Monaco from 'monaco-editor'
import type { CodeEditor } from './CodeEditor'

export interface PoolOptions {
  minSize?: number
  maxSize?: number
  maxIdleTime?: number
  warmup?: boolean
}

export interface PoolStats {
  total: number
  active: number
  idle: number
  created: number
  reused: number
  destroyed: number
}

/**
 * 编辑器池项
 */
interface PoolItem {
  editor: CodeEditor
  inUse: boolean
  lastUsed: number
  created: number
  usageCount: number
}

/**
 * 编辑器实例池类
 */
export class EditorPool {
  private pool: PoolItem[] = []
  private options: Required<PoolOptions>
  private stats: PoolStats = {
    total: 0,
    active: 0,
    idle: 0,
    created: 0,
    reused: 0,
    destroyed: 0,
  }
  private cleanupInterval: ReturnType<typeof setInterval> | null = null
  private editorFactory: (container: HTMLElement) => CodeEditor

  constructor(
    editorFactory: (container: HTMLElement) => CodeEditor,
    options: PoolOptions = {}
  ) {
    this.editorFactory = editorFactory
    this.options = {
      minSize: options.minSize || 0,
      maxSize: options.maxSize || 10,
      maxIdleTime: options.maxIdleTime || 5 * 60 * 1000, // 5 minutes
      warmup: options.warmup || false,
    }

    if (this.options.warmup) {
      this.warmUp()
    }

    this.startCleanup()
  }

  /**
   * 预热池
   */
  private warmUp(): void {
    const count = this.options.minSize
    for (let i = 0; i < count; i++) {
      // 创建隐藏容器
      const container = this.createHiddenContainer()
      const editor = this.editorFactory(container)

      this.pool.push({
        editor,
        inUse: false,
        lastUsed: Date.now(),
        created: Date.now(),
        usageCount: 0,
      })

      this.stats.created++
      this.stats.idle++
    }

    this.stats.total = this.pool.length
  }

  /**
   * 创建隐藏容器
   */
  private createHiddenContainer(): HTMLElement {
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.top = '-9999px'
    container.style.left = '-9999px'
    container.style.width = '800px'
    container.style.height = '600px'
    document.body.appendChild(container)
    return container
  }

  /**
   * 获取编辑器
   */
  acquire(container: HTMLElement): CodeEditor {
    // 尝试从池中获取空闲编辑器
    const idleItem = this.pool.find((item) => !item.inUse)

    if (idleItem) {
      idleItem.inUse = true
      idleItem.lastUsed = Date.now()
      idleItem.usageCount++

      this.stats.active++
      this.stats.idle--
      this.stats.reused++

      // TODO: 将编辑器移动到新容器
      return idleItem.editor
    }

    // 如果池未满，创建新编辑器
    if (this.pool.length < this.options.maxSize) {
      const editor = this.editorFactory(container)

      const item: PoolItem = {
        editor,
        inUse: true,
        lastUsed: Date.now(),
        created: Date.now(),
        usageCount: 1,
      }

      this.pool.push(item)

      this.stats.created++
      this.stats.active++
      this.stats.total++

      return editor
    }

    // 池已满，强制创建新编辑器（不加入池）
    console.warn('Editor pool is full, creating temporary editor')
    return this.editorFactory(container)
  }

  /**
   * 释放编辑器
   */
  release(editor: CodeEditor): void {
    const item = this.pool.find((i) => i.editor === editor)

    if (item && item.inUse) {
      item.inUse = false
      item.lastUsed = Date.now()

      this.stats.active--
      this.stats.idle++

      // 清理编辑器状态
      this.resetEditor(editor)
    }
  }

  /**
   * 重置编辑器状态
   */
  private resetEditor(editor: CodeEditor): void {
    try {
      editor.setValue('')
      // 可以添加更多清理逻辑
    } catch (error) {
      console.error('Failed to reset editor:', error)
    }
  }

  /**
   * 开始清理任务
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60000) // 每分钟清理一次
  }

  /**
   * 清理空闲编辑器
   */
  private cleanup(): void {
    const now = Date.now()
    const toRemove: number[] = []

    // 找出需要清理的编辑器
    this.pool.forEach((item, index) => {
      if (
        !item.inUse &&
        now - item.lastUsed > this.options.maxIdleTime &&
        this.pool.length > this.options.minSize
      ) {
        toRemove.push(index)
      }
    })

    // 从后向前删除
    toRemove.reverse().forEach((index) => {
      const item = this.pool[index]
      try {
        item.editor.dispose()
        this.pool.splice(index, 1)

        this.stats.destroyed++
        this.stats.idle--
        this.stats.total--
      } catch (error) {
        console.error('Failed to dispose editor:', error)
      }
    })

    if (toRemove.length > 0) {
      console.debug(`Cleaned up ${toRemove.length} idle editors`)
    }
  }

  /**
   * 获取池统计
   */
  getStats(): PoolStats {
    return { ...this.stats }
  }

  /**
   * 获取池大小
   */
  size(): number {
    return this.pool.length
  }

  /**
   * 获取活跃编辑器数量
   */
  activeCount(): number {
    return this.pool.filter((item) => item.inUse).length
  }

  /**
   * 获取空闲编辑器数量
   */
  idleCount(): number {
    return this.pool.filter((item) => !item.inUse).length
  }

  /**
   * 清空池
   */
  clear(): void {
    this.pool.forEach((item) => {
      try {
        item.editor.dispose()
      } catch (error) {
        console.error('Failed to dispose editor:', error)
      }
    })

    this.pool = []

    this.stats = {
      total: 0,
      active: 0,
      idle: 0,
      created: this.stats.created,
      reused: this.stats.reused,
      destroyed: this.stats.destroyed + this.pool.length,
    }
  }

  /**
   * 销毁池
   */
  dispose(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }

    this.clear()
  }

  /**
   * 生成池报告
   */
  generateReport(): string {
    const stats = this.getStats()

    return `
Editor Pool Report
==========================================
Total Editors: ${stats.total}
Active: ${stats.active}
Idle: ${stats.idle}
Created: ${stats.created}
Reused: ${stats.reused}
Destroyed: ${stats.destroyed}
Reuse Rate: ${stats.reused > 0 ? ((stats.reused / stats.created) * 100).toFixed(2) : 0}%
==========================================
    `.trim()
  }
}

