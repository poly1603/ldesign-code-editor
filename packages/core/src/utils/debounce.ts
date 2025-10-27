/**
 * 防抖和节流工具函数
 */

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @param immediate 是否立即执行
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait = 300,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(this: unknown, ...args: Parameters<T>): void {
    const later = () => {
      timeout = null
      if (!immediate) {
        func.apply(this, args)
      }
    }

    const callNow = immediate && !timeout

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(later, wait)

    if (callNow) {
      func.apply(this, args)
    }
  }
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 限制时间（毫秒）
 * @param options 选项
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit = 100,
  options: { leading?: boolean; trailing?: boolean } = {}
): (...args: Parameters<T>) => void {
  const { leading = true, trailing = true } = options
  let inThrottle = false
  let lastFunc: ReturnType<typeof setTimeout> | null = null
  let lastRan: number | null = null

  return function executedFunction(this: unknown, ...args: Parameters<T>): void {
    if (!inThrottle) {
      if (leading) {
        func.apply(this, args)
      }
      lastRan = Date.now()
      inThrottle = true

      setTimeout(() => {
        inThrottle = false
      }, limit)
    } else if (trailing) {
      if (lastFunc) {
        clearTimeout(lastFunc)
      }

      lastFunc = setTimeout(() => {
        if (lastRan && Date.now() - lastRan >= limit) {
          func.apply(this, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - (lastRan || 0)))
    }
  }
}

/**
 * RequestAnimationFrame 节流
 * @param func 要节流的函数
 */
export function rafThrottle<T extends (...args: unknown[]) => unknown>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null

  return function executedFunction(this: unknown, ...args: Parameters<T>): void {
    if (rafId !== null) {
      return
    }

    rafId = requestAnimationFrame(() => {
      func.apply(this, args)
      rafId = null
    })
  }
}

/**
 * 批量处理函数
 * @param func 要批量处理的函数
 * @param wait 等待时间（毫秒）
 */
export function batchProcess<T>(
  func: (items: T[]) => void,
  wait = 100
): (item: T) => void {
  let items: T[] = []
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(item: T): void {
    items.push(item)

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(items)
      items = []
      timeout = null
    }, wait)
  }
}

/**
 * 异步防抖
 * @param func 异步函数
 * @param wait 等待时间（毫秒）
 */
export function asyncDebounce<T extends (...args: unknown[]) => Promise<unknown>>(
  func: T,
  wait = 300
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let pendingPromise: Promise<ReturnType<T>> | null = null

  return function executedFunction(this: unknown, ...args: Parameters<T>): Promise<ReturnType<T>> {
    if (timeout) {
      clearTimeout(timeout)
    }

    if (!pendingPromise) {
      pendingPromise = new Promise((resolve) => {
        timeout = setTimeout(async () => {
          const result = await func.apply(this, args)
          resolve(result as ReturnType<T>)
          pendingPromise = null
          timeout = null
        }, wait)
      })
    }

    return pendingPromise
  }
}

/**
 * 延迟执行
 * @param ms 延迟时间（毫秒）
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 超时控制
 * @param promise 要控制的 Promise
 * @param timeout 超时时间（毫秒）
 * @param errorMessage 超时错误消息
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeout: number,
  errorMessage = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeout)
    ),
  ])
}

/**
 * 重试函数
 * @param func 要重试的函数
 * @param retries 重试次数
 * @param delayMs 重试间隔（毫秒）
 */
export async function retry<T>(
  func: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error | null = null

  for (let i = 0; i <= retries; i++) {
    try {
      return await func()
    } catch (error) {
      lastError = error as Error
      if (i < retries) {
        await delay(delayMs * (i + 1)) // 指数退避
      }
    }
  }

  throw lastError || new Error('Retry failed')
}

