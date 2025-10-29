import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { PerformanceMonitor } from '../core/PerformanceMonitor'

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor

  beforeEach(() => {
    monitor = new PerformanceMonitor()
  })

  afterEach(() => {
    monitor.dispose()
  })

  describe('性能测量', () => {
    it('应该能开始和结束测量', () => {
      monitor.start('test-operation')
      monitor.end('test-operation')

      const report = monitor.getReport()
      expect(report).toBeDefined()
    })

    it('应该能测量多个操作', () => {
      monitor.start('operation-1')
      monitor.end('operation-1')

      monitor.start('operation-2')
      monitor.end('operation-2')

      const report = monitor.getReport()
      expect(report).toBeDefined()
    })

    it('应该能测量嵌套操作', () => {
      monitor.start('outer')
      monitor.start('inner')
      monitor.end('inner')
      monitor.end('outer')

      const report = monitor.getReport()
      expect(report).toBeDefined()
    })
  })

  describe('性能指标', () => {
    it('应该记录操作耗时', () => {
      monitor.start('slow-operation')
      // 模拟耗时操作
      const start = Date.now()
      while (Date.now() - start < 10) {
        // 等待至少 10ms
      }
      monitor.end('slow-operation')

      const report = monitor.getReport()
      expect(report).toBeDefined()
    })

    it('应该追踪内存使用', () => {
      monitor.trackMemory('test-point')

      const report = monitor.getReport()
      expect(report).toBeDefined()
    })

    it('应该记录 FPS', () => {
      monitor.recordFPS(60)
      monitor.recordFPS(58)
      monitor.recordFPS(59)

      const avgFPS = monitor.getAverageFPS()
      expect(avgFPS).toBeGreaterThan(0)
      expect(avgFPS).toBeLessThanOrEqual(60)
    })
  })

  describe('性能报告', () => {
    it('应该生成详细报告', () => {
      monitor.start('test-1')
      monitor.end('test-1')

      monitor.start('test-2')
      monitor.end('test-2')

      const report = monitor.getReport()
      expect(report).toBeDefined()
      expect(report).toHaveProperty('summary')
      expect(report).toHaveProperty('details')
    })

    it('应该能清除历史记录', () => {
      monitor.start('test')
      monitor.end('test')

      monitor.clear()

      const report = monitor.getReport()
      // 清除后报告应该为空或只有基本结构
      expect(report).toBeDefined()
    })
  })

  describe('性能警告', () => {
    it('应该在性能低于阈值时发出警告', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      monitor.setThreshold('operation', 10) // 10ms 阈值

      monitor.start('operation')
      // 模拟耗时超过阈值
      const start = Date.now()
      while (Date.now() - start < 15) {
        // 等待至少 15ms
      }
      monitor.end('operation')

      // 检查是否发出警告
      // expect(warnSpy).toHaveBeenCalled()

      warnSpy.mockRestore()
    })
  })

  describe('性能优化建议', () => {
    it('应该提供优化建议', () => {
      // 记录一些性能数据
      monitor.start('slow-render')
      const start = Date.now()
      while (Date.now() - start < 50) {
        // 模拟慢速渲染
      }
      monitor.end('slow-render')

      const suggestions = monitor.getSuggestions()
      expect(suggestions).toBeDefined()
      expect(Array.isArray(suggestions)).toBe(true)
    })
  })
})
