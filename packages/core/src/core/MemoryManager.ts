/**
 * 内存管理器
 * 监控和优化内存使用
 */

export interface MemoryStats {
  usedHeapSize: number
  totalHeapSize: number
  heapLimit: number
  usagePercentage: number
  timestamp: number
}

export interface MemoryThreshold {
  warning: number // 警告阈值（百分比）
  critical: number // 严重阈值（百分比）
}

export type MemoryCallback = (stats: MemoryStats) => void

/**
 * 内存管理器类
 */
export class MemoryManager {
  private thresholds: MemoryThreshold = {
    warning: 75,
    critical: 90,
  }
  private callbacks = new Set<MemoryCallback>()
  private monitoringInterval: ReturnType<typeof setInterval> | null = null
  private weakReferences = new WeakMap<object, string>()
  private referenceRegistry = new FinalizationRegistry<string>((id) => {
    console.debug(`Object ${id} was garbage collected`)
  })

  /**
   * 设置内存阈值
   */
  setThresholds(thresholds: Partial<MemoryThreshold>): void {
    this.thresholds = { ...this.thresholds, ...thresholds }
  }

  /**
   * 获取内存统计
   */
  getMemoryStats(): MemoryStats | null {
    if (!('memory' in performance)) {
      return null
    }

    const memory = (performance as {
      memory: {
        usedJSHeapSize: number
        totalJSHeapSize: number
        jsHeapSizeLimit: number
      }
    }).memory

    const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100

    return {
      usedHeapSize: memory.usedJSHeapSize,
      totalHeapSize: memory.totalJSHeapSize,
      heapLimit: memory.jsHeapSizeLimit,
      usagePercentage,
      timestamp: Date.now(),
    }
  }

  /**
   * 检查内存状态
   */
  checkMemoryStatus(): 'normal' | 'warning' | 'critical' | null {
    const stats = this.getMemoryStats()

    if (!stats) {
      return null
    }

    if (stats.usagePercentage >= this.thresholds.critical) {
      return 'critical'
    }

    if (stats.usagePercentage >= this.thresholds.warning) {
      return 'warning'
    }

    return 'normal'
  }

  /**
   * 监听内存变化
   */
  onMemoryChange(callback: MemoryCallback): () => void {
    this.callbacks.add(callback)

    return () => {
      this.callbacks.delete(callback)
    }
  }

  /**
   * 开始监控内存
   */
  startMonitoring(interval = 5000): void {
    if (this.monitoringInterval) {
      return
    }

    this.monitoringInterval = setInterval(() => {
      const stats = this.getMemoryStats()

      if (stats) {
        this.callbacks.forEach((callback) => callback(stats))

        const status = this.checkMemoryStatus()

        if (status === 'critical') {
          console.error('Critical memory usage!', stats)
          this.triggerGarbageCollection()
        } else if (status === 'warning') {
          console.warn('High memory usage!', stats)
        }
      }
    }, interval)
  }

  /**
   * 停止监控内存
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = null
    }
  }

  /**
   * 触发垃圾回收（仅在某些环境可用）
   */
  triggerGarbageCollection(): void {
    if (globalThis.gc) {
      try {
        globalThis.gc()
        console.debug('Garbage collection triggered')
      } catch (error) {
        console.warn('Failed to trigger garbage collection:', error)
      }
    }
  }

  /**
   * 注册对象用于内存泄漏检测
   */
  registerObject(obj: object, id: string): void {
    this.weakReferences.set(obj, id)
    this.referenceRegistry.register(obj, id)
  }

  /**
   * 检测内存泄漏
   */
  async detectLeaks(timeout = 5000): Promise<string[]> {
    const leakedObjects: string[] = []
    const registeredObjects = new Map<object, string>()

    // 创建测试对象
    for (let i = 0; i < 100; i++) {
      const obj = { test: i }
      const id = `test-${i}`
      registeredObjects.set(obj, id)
      this.registerObject(obj, id)
    }

    // 清除引用
    registeredObjects.clear()

    // 尝试触发 GC
    this.triggerGarbageCollection()

    // 等待一段时间
    await new Promise((resolve) => setTimeout(resolve, timeout))

    return leakedObjects
  }

  /**
   * 清理大型对象
   */
  clearLargeObjects<T>(
    collection: T[],
    predicate: (item: T) => boolean = () => true
  ): number {
    let cleared = 0
    for (let i = collection.length - 1; i >= 0; i--) {
      if (predicate(collection[i])) {
        collection.splice(i, 1)
        cleared++
      }
    }
    return cleared
  }

  /**
   * 优化字符串内存
   */
  deduplicateStrings(strings: string[]): string[] {
    const seen = new Set<string>()
    const deduplicated: string[] = []

    for (const str of strings) {
      if (!seen.has(str)) {
        seen.add(str)
        deduplicated.push(str)
      }
    }

    return deduplicated
  }

  /**
   * 获取对象大小估算
   */
  estimateObjectSize(obj: unknown): number {
    const seen = new WeakSet()

    function sizeOf(value: unknown): number {
      if (value === null || value === undefined) {
        return 0
      }

      switch (typeof value) {
        case 'boolean':
          return 4
        case 'number':
          return 8
        case 'string':
          return (value as string).length * 2
        case 'object':
          if (seen.has(value as object)) {
            return 0
          }

          seen.add(value as object)

          if (Array.isArray(value)) {
            return value.reduce((total, item) => total + sizeOf(item), 0)
          }

          return Object.keys(value).reduce((total, key) => {
            return total + key.length * 2 + sizeOf((value as Record<string, unknown>)[key])
          }, 0)

        default:
          return 0
      }
    }

    return sizeOf(obj)
  }

  /**
   * 创建内存快照
   */
  createSnapshot(): {
    timestamp: number
    stats: MemoryStats | null
    status: string | null
  } {
    return {
      timestamp: Date.now(),
      stats: this.getMemoryStats(),
      status: this.checkMemoryStatus(),
    }
  }

  /**
   * 比较两个快照
   */
  compareSnapshots(
    snapshot1: ReturnType<typeof this.createSnapshot>,
    snapshot2: ReturnType<typeof this.createSnapshot>
  ): {
    heapGrowth: number
    timeElapsed: number
    growthRate: number
  } | null {
    if (!snapshot1.stats || !snapshot2.stats) {
      return null
    }

    const heapGrowth = snapshot2.stats.usedHeapSize - snapshot1.stats.usedHeapSize
    const timeElapsed = snapshot2.timestamp - snapshot1.timestamp
    const growthRate = heapGrowth / (timeElapsed / 1000) // bytes per second

    return {
      heapGrowth,
      timeElapsed,
      growthRate,
    }
  }

  /**
   * 格式化字节大小
   */
  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  /**
   * 生成内存报告
   */
  generateReport(): string {
    const stats = this.getMemoryStats()

    if (!stats) {
      return 'Memory statistics not available'
    }

    return `
Memory Report (${new Date(stats.timestamp).toLocaleString()})
==========================================
Used Heap: ${this.formatBytes(stats.usedHeapSize)}
Total Heap: ${this.formatBytes(stats.totalHeapSize)}
Heap Limit: ${this.formatBytes(stats.heapLimit)}
Usage: ${stats.usagePercentage.toFixed(2)}%
Status: ${this.checkMemoryStatus()}
==========================================
    `.trim()
  }

  /**
   * 销毁管理器
   */
  dispose(): void {
    this.stopMonitoring()
    this.callbacks.clear()
  }
}

// 导出全局实例
export const globalMemoryManager = new MemoryManager()

