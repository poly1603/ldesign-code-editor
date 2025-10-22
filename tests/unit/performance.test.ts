/**
 * 性能相关测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { LRUCache, MemoryCache } from '../../src/utils/cache'
import { debounce, throttle, memoize } from '../../src/utils/debounce'
import { PerformanceMonitor } from '../../src/core/PerformanceMonitor'

describe('LRUCache', () => {
  let cache: LRUCache<string>

  beforeEach(() => {
    cache = new LRUCache({ maxSize: 3 })
  })

  it('should store and retrieve values', () => {
    cache.set('key1', 'value1')
    expect(cache.get('key1')).toBe('value1')
  })

  it('should evict least recently used items', () => {
    cache.set('key1', 'value1')
    cache.set('key2', 'value2')
    cache.set('key3', 'value3')
    cache.set('key4', 'value4')

    expect(cache.has('key1')).toBe(false)
    expect(cache.has('key4')).toBe(true)
  })
})

describe('debounce', () => {
  it('should debounce function calls', async () => {
    let count = 0
    const fn = debounce(() => count++, 100)

    fn()
    fn()
    fn()

    expect(count).toBe(0)

    await new Promise((r) => setTimeout(r, 150))
    expect(count).toBe(1)
  })
})

describe('memoize', () => {
  it('should cache function results', () => {
    let calls = 0
    const fn = memoize((x: number) => {
      calls++
      return x * 2
    })

    expect(fn(5)).toBe(10)
    expect(fn(5)).toBe(10)
    expect(calls).toBe(1)
  })
})

describe('PerformanceMonitor', () => {
  it('should record metrics', () => {
    const monitor = new PerformanceMonitor()
    monitor.recordMetric('test', 100, 'custom')

    const metrics = monitor.getMetrics()
    expect(metrics).toHaveLength(1)
    expect(metrics[0].name).toBe('test')
    expect(metrics[0].value).toBe(100)
  })
})

