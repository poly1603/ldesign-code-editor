/**
 * 性能监控器
 * 监控编辑器性能指标
 */

export interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  category: 'load' | 'render' | 'interaction' | 'memory' | 'custom'
}

export interface PerformanceReport {
  metrics: PerformanceMetric[]
  summary: {
    totalMetrics: number
    averageValue: number
    minValue: number
    maxValue: number
  }
  categories: Record<string, number>
}

/**
 * 性能监控器类
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private marks = new Map<string, number>()
  private maxMetrics = 1000
  private enabled = true

  constructor(maxMetrics = 1000) {
    this.maxMetrics = maxMetrics
  }

  /**
   * 启用监控
   */
  enable(): void {
    this.enabled = true
  }

  /**
   * 禁用监控
   */
  disable(): void {
    this.enabled = false
  }

  /**
   * 记录性能标记
   */
  mark(name: string): void {
    if (!this.enabled) return

    this.marks.set(name, performance.now())

    if (performance.mark) {
      performance.mark(name)
    }
  }

  /**
   * 测量性能
   */
  measure(
    name: string,
    startMark?: string,
    endMark?: string,
    category: PerformanceMetric['category'] = 'custom'
  ): number | null {
    if (!this.enabled) return null

    try {
      let duration: number

      if (startMark && this.marks.has(startMark)) {
        const startTime = this.marks.get(startMark)!
        const endTime = endMark && this.marks.has(endMark) ? this.marks.get(endMark)! : performance.now()
        duration = endTime - startTime

        // 使用 Performance API
        if (performance.measure) {
          try {
            performance.measure(name, startMark, endMark)
          } catch {
            // 忽略错误
          }
        }
      } else {
        duration = 0
      }

      this.recordMetric(name, duration, category)
      return duration
    } catch (error) {
      console.error('Performance measure error:', error)
      return null
    }
  }

  /**
   * 记录指标
   */
  recordMetric(
    name: string,
    value: number,
    category: PerformanceMetric['category'] = 'custom'
  ): void {
    if (!this.enabled) return

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      category,
    }

    this.metrics.push(metric)

    // 限制指标数量
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift()
    }
  }

  /**
   * 获取所有指标
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  /**
   * 获取指标按类别
   */
  getMetricsByCategory(category: PerformanceMetric['category']): PerformanceMetric[] {
    return this.metrics.filter((m) => m.category === category)
  }

  /**
   * 获取指标按名称
   */
  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter((m) => m.name === name)
  }

  /**
   * 生成性能报告
   */
  generateReport(): PerformanceReport {
    const values = this.metrics.map((m) => m.value)
    const categories = this.metrics.reduce(
      (acc, m) => {
        acc[m.category] = (acc[m.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return {
      metrics: this.metrics,
      summary: {
        totalMetrics: this.metrics.length,
        averageValue: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
        minValue: values.length > 0 ? Math.min(...values) : 0,
        maxValue: values.length > 0 ? Math.max(...values) : 0,
      },
      categories,
    }
  }

  /**
   * 清除所有指标
   */
  clear(): void {
    this.metrics = []
    this.marks.clear()

    if (performance.clearMarks) {
      performance.clearMarks()
    }
    if (performance.clearMeasures) {
      performance.clearMeasures()
    }
  }

  /**
   * 监控内存使用
   */
  getMemoryUsage(): { usedJSHeapSize: number; totalJSHeapSize: number; limit: number } | null {
    if ('memory' in performance && (performance as { memory?: unknown }).memory) {
      const memory = (performance as {
        memory: {
          usedJSHeapSize: number
          totalJSHeapSize: number
          jsHeapSizeLimit: number
        }
      }).memory

      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      }
    }

    return null
  }

  /**
   * 监控 FPS
   */
  monitorFPS(duration = 1000): Promise<number> {
    return new Promise((resolve) => {
      let frames = 0
      let lastTime = performance.now()
      let animationId: number

      const measureFrame = () => {
        frames++
        const currentTime = performance.now()

        if (currentTime - lastTime >= duration) {
          const fps = (frames * 1000) / (currentTime - lastTime)
          cancelAnimationFrame(animationId)
          resolve(fps)
        } else {
          animationId = requestAnimationFrame(measureFrame)
        }
      }

      animationId = requestAnimationFrame(measureFrame)
    })
  }

  /**
   * 监控长任务
   */
  observeLongTasks(threshold = 50): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > threshold) {
              this.recordMetric(`long-task:${entry.name}`, entry.duration, 'interaction')
            }
          }
        })

        observer.observe({ entryTypes: ['longtask', 'measure'] })
      } catch {
        // PerformanceObserver 不支持或出错
      }
    }
  }

  /**
   * 获取导航时间
   */
  getNavigationTiming(): Record<string, number> | null {
    if (!performance.timing) {
      return null
    }

    const timing = performance.timing
    const navigationStart = timing.navigationStart

    return {
      redirect: timing.redirectEnd - timing.redirectStart,
      dns: timing.domainLookupEnd - timing.domainLookupStart,
      tcp: timing.connectEnd - timing.connectStart,
      request: timing.responseStart - timing.requestStart,
      response: timing.responseEnd - timing.responseStart,
      dom: timing.domComplete - timing.domLoading,
      load: timing.loadEventEnd - timing.loadEventStart,
      total: timing.loadEventEnd - navigationStart,
    }
  }

  /**
   * 导出指标为 JSON
   */
  exportToJSON(): string {
    return JSON.stringify(this.generateReport(), null, 2)
  }

  /**
   * 导出指标为 CSV
   */
  exportToCSV(): string {
    const header = 'Name,Value,Timestamp,Category\n'
    const rows = this.metrics.map((m) =>
      `${m.name},${m.value},${m.timestamp},${m.category}`
    ).join('\n')

    return header + rows
  }
}

/**
 * 性能监控装饰器
 */
export function Measure(category: PerformanceMetric['category'] = 'custom') {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value
    const monitor = new PerformanceMonitor()

    descriptor.value = async function (this: unknown, ...args: unknown[]) {
      const startMark = `${propertyKey}-start`
      const endMark = `${propertyKey}-end`

      monitor.mark(startMark)

      try {
        const result = await originalMethod.apply(this, args)
        monitor.mark(endMark)
        monitor.measure(propertyKey, startMark, endMark, category)
        return result
      } catch (error) {
        monitor.mark(endMark)
        monitor.measure(`${propertyKey}-error`, startMark, endMark, category)
        throw error
      }
    }

    return descriptor
  }
}

// 导出全局实例
export const globalPerformanceMonitor = new PerformanceMonitor()

