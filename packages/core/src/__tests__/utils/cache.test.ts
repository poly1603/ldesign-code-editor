import { describe, it, expect, beforeEach } from 'vitest'
import { LRUCache, MemoryCache, memoize } from '../../utils/cache'

describe('LRUCache', () => {
  let cache: LRUCache<string, number>

  beforeEach(() => {
    cache = new LRUCache<string, number>(3)
  })

  it('应该能存储和获取值', () => {
    cache.set('a', 1)
    expect(cache.get('a')).toBe(1)
  })

  it('应该在超出容量时删除最少使用的项', () => {
    cache.set('a', 1)
    cache.set('b', 2)
    cache.set('c', 3)
    cache.set('d', 4) // 这会导致 'a' 被删除

    expect(cache.has('a')).toBe(false)
    expect(cache.has('b')).toBe(true)
    expect(cache.has('c')).toBe(true)
    expect(cache.has('d')).toBe(true)
  })

  it('应该在访问时更新项的使用时间', () => {
    cache.set('a', 1)
    cache.set('b', 2)
    cache.set('c', 3)

    // 访问 'a'，使其成为最近使用的
    cache.get('a')

    cache.set('d', 4) // 现在应该删除 'b' 而不是 'a'

    expect(cache.has('a')).toBe(true)
    expect(cache.has('b')).toBe(false)
    expect(cache.has('c')).toBe(true)
    expect(cache.has('d')).toBe(true)
  })

  it('应该能删除指定的项', () => {
    cache.set('a', 1)
    cache.set('b', 2)

    expect(cache.delete('a')).toBe(true)
    expect(cache.has('a')).toBe(false)
    expect(cache.delete('a')).toBe(false)
  })

  it('应该能清空所有项', () => {
    cache.set('a', 1)
    cache.set('b', 2)
    cache.set('c', 3)

    cache.clear()

    expect(cache.size).toBe(0)
    expect(cache.has('a')).toBe(false)
    expect(cache.has('b')).toBe(false)
    expect(cache.has('c')).toBe(false)
  })

  it('应该正确报告缓存大小', () => {
    expect(cache.size).toBe(0)

    cache.set('a', 1)
    expect(cache.size).toBe(1)

    cache.set('b', 2)
    expect(cache.size).toBe(2)

    cache.delete('a')
    expect(cache.size).toBe(1)
  })
})

describe('MemoryCache', () => {
  let cache: MemoryCache<string, number>

  beforeEach(() => {
    cache = new MemoryCache<string, number>({ maxSize: 3, ttl: 1000 })
  })

  it('应该能存储和获取值', () => {
    cache.set('a', 1)
    expect(cache.get('a')).toBe(1)
  })

  it('应该在 TTL 过期后删除项', async () => {
    const shortCache = new MemoryCache<string, number>({ ttl: 100 })
    shortCache.set('a', 1)

    expect(shortCache.get('a')).toBe(1)

    // 等待超过 TTL
    await new Promise(resolve => setTimeout(resolve, 150))

    expect(shortCache.get('a')).toBeUndefined()
  })

  it('应该在超出容量时删除最旧的项', () => {
    cache.set('a', 1)
    cache.set('b', 2)
    cache.set('c', 3)
    cache.set('d', 4)

    expect(cache.has('a')).toBe(false)
    expect(cache.has('d')).toBe(true)
  })

  it('应该支持自定义 TTL', async () => {
    cache.set('a', 1, 100)
    cache.set('b', 2, 1000)

    await new Promise(resolve => setTimeout(resolve, 150))

    expect(cache.get('a')).toBeUndefined()
    expect(cache.get('b')).toBe(2)
  })
})

describe('memoize', () => {
  it('应该缓存函数结果', () => {
    let callCount = 0
    const fn = memoize((x: number) => {
      callCount++
      return x * 2
    })

    expect(fn(5)).toBe(10)
    expect(callCount).toBe(1)

    expect(fn(5)).toBe(10)
    expect(callCount).toBe(1) // 应该使用缓存，不再调用

    expect(fn(10)).toBe(20)
    expect(callCount).toBe(2)
  })

  it('应该支持多个参数', () => {
    let callCount = 0
    const fn = memoize((x: number, y: number) => {
      callCount++
      return x + y
    })

    expect(fn(1, 2)).toBe(3)
    expect(callCount).toBe(1)

    expect(fn(1, 2)).toBe(3)
    expect(callCount).toBe(1)

    expect(fn(2, 3)).toBe(5)
    expect(callCount).toBe(2)
  })

  it('应该支持自定义键生成器', () => {
    let callCount = 0
    const fn = memoize(
      (obj: { x: number, y: number }) => {
        callCount++
        return obj.x + obj.y
      },
      (obj) => `${obj.x}-${obj.y}`,
    )

    expect(fn({ x: 1, y: 2 })).toBe(3)
    expect(callCount).toBe(1)

    expect(fn({ x: 1, y: 2 })).toBe(3)
    expect(callCount).toBe(1) // 应该使用缓存
  })
})
