/**
 * 缓存工具
 * 实现多种缓存策略和存储机制
 */

export interface CacheOptions {
  maxSize?: number
  ttl?: number // Time to live in milliseconds
  onEvict?: (key: string, value: unknown) => void
}

export interface CacheEntry<T> {
  value: T
  timestamp: number
  hits: number
}

/**
 * LRU (Least Recently Used) 缓存
 */
export class LRUCache<T = unknown> {
  private cache = new Map<string, CacheEntry<T>>()
  private maxSize: number
  private ttl: number
  private onEvict?: (key: string, value: T) => void

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 100
    this.ttl = options.ttl || Infinity
    this.onEvict = options.onEvict as ((key: string, value: T) => void) | undefined
  }

  /**
   * 获取缓存值
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key)

    if (!entry) {
      return undefined
    }

    // 检查是否过期
    if (this.isExpired(entry)) {
      this.delete(key)
      return undefined
    }

    // 更新访问信息
    entry.hits++
    entry.timestamp = Date.now()

    // 移到最后（LRU）
    this.cache.delete(key)
    this.cache.set(key, entry)

    return entry.value
  }

  /**
   * 设置缓存值
   */
  set(key: string, value: T): void {
    // 如果已存在，先删除
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }

    // 如果达到最大容量，删除最早的项
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.delete(firstKey)
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      hits: 0,
    })
  }

  /**
   * 删除缓存
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key)
    if (entry && this.onEvict) {
      this.onEvict(key, entry.value)
    }
    return this.cache.delete(key)
  }

  /**
   * 检查是否存在
   */
  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) {
      return false
    }

    if (this.isExpired(entry)) {
      this.delete(key)
      return false
    }

    return true
  }

  /**
   * 清空缓存
   */
  clear(): void {
    if (this.onEvict) {
      this.cache.forEach((entry, key) => {
        this.onEvict!(key, entry.value)
      })
    }
    this.cache.clear()
  }

  /**
   * 获取缓存大小
   */
  size(): number {
    return this.cache.size
  }

  /**
   * 获取所有键
   */
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  /**
   * 检查是否过期
   */
  private isExpired(entry: CacheEntry<T>): boolean {
    if (this.ttl === Infinity) {
      return false
    }
    return Date.now() - entry.timestamp > this.ttl
  }

  /**
   * 清理过期项
   */
  cleanup(): number {
    let cleaned = 0
    const now = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.delete(key)
        cleaned++
      }
    }

    return cleaned
  }

  /**
   * 获取统计信息
   */
  getStats() {
    let totalHits = 0
    const entries = Array.from(this.cache.values())

    entries.forEach((entry) => {
      totalHits += entry.hits
    })

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      totalHits,
      averageHits: entries.length > 0 ? totalHits / entries.length : 0,
    }
  }
}

/**
 * WeakMap 缓存（用于对象键）
 */
export class WeakCache<K extends object, V> {
  private cache = new WeakMap<K, V>()

  get(key: K): V | undefined {
    return this.cache.get(key)
  }

  set(key: K, value: V): void {
    this.cache.set(key, value)
  }

  has(key: K): boolean {
    return this.cache.has(key)
  }

  delete(key: K): boolean {
    return this.cache.delete(key)
  }
}

/**
 * 内存缓存（用于服务器端）
 */
export class MemoryCache<T = unknown> extends LRUCache<T> {
  private cleanupInterval: ReturnType<typeof setInterval> | null = null

  constructor(options: CacheOptions & { cleanupInterval?: number } = {}) {
    super(options)

    // 自动清理过期项
    if (options.cleanupInterval) {
      this.startCleanup(options.cleanupInterval)
    }
  }

  /**
   * 开始自动清理
   */
  private startCleanup(interval: number): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, interval)
  }

  /**
   * 停止自动清理
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }

  /**
   * 销毁缓存
   */
  dispose(): void {
    this.stopCleanup()
    this.clear()
  }
}

/**
 * 缓存装饰器
 */
export function Cacheable(options: CacheOptions = {}) {
  const cache = new LRUCache(options)

  return function (
    _target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value

    descriptor.value = function (this: unknown, ...args: unknown[]) {
      const key = JSON.stringify(args)

      if (cache.has(key)) {
        return cache.get(key)
      }

      const result = originalMethod.apply(this, args)

      // 如果是 Promise，等待结果后缓存
      if (result instanceof Promise) {
        return result.then((value) => {
          cache.set(key, value)
          return value
        })
      }

      cache.set(key, result)
      return result
    }

    return descriptor
  }
}

/**
 * Memoization 函数
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()

  return function memoized(this: unknown, ...args: Parameters<T>): ReturnType<T> {
    const key = resolver ? resolver(...args) : JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = func.apply(this, args) as ReturnType<T>
    cache.set(key, result)

    return result
  } as T
}

// 导出默认缓存实例
export const globalCache = new MemoryCache({ maxSize: 500, ttl: 5 * 60 * 1000 }) // 5分钟

