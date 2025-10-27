/**
 * 中间件系统
 * 实现编辑器操作的拦截和处理
 */

export type MiddlewareContext<T = unknown> = {
  data: T
  editor: unknown
  timestamp: number
  metadata?: Record<string, unknown>
}

export type NextFunction = () => Promise<void> | void

export type MiddlewareFunction<T = unknown> = (
  context: MiddlewareContext<T>,
  next: NextFunction
) => Promise<void> | void

/**
 * 中间件管理器
 */
export class MiddlewareManager<T = unknown> {
  private middlewares: MiddlewareFunction<T>[] = []

  /**
   * 添加中间件
   */
  use(middleware: MiddlewareFunction<T>): this {
    this.middlewares.push(middleware)
    return this
  }

  /**
   * 移除中间件
   */
  remove(middleware: MiddlewareFunction<T>): boolean {
    const index = this.middlewares.indexOf(middleware)
    if (index !== -1) {
      this.middlewares.splice(index, 1)
      return true
    }
    return false
  }

  /**
   * 清空所有中间件
   */
  clear(): void {
    this.middlewares = []
  }

  /**
   * 执行中间件链
   */
  async execute(context: MiddlewareContext<T>): Promise<void> {
    let index = 0

    const next = async (): Promise<void> => {
      if (index >= this.middlewares.length) {
        return
      }

      const middleware = this.middlewares[index++]
      await middleware(context, next)
    }

    await next()
  }

  /**
   * 获取中间件数量
   */
  size(): number {
    return this.middlewares.length
  }
}

/**
 * 内置中间件 - 日志记录
 */
export function loggingMiddleware<T>(
  context: MiddlewareContext<T>,
  next: NextFunction
): void {
  const start = Date.now()
  console.debug('[Middleware] Start:', context)

  next()

  const duration = Date.now() - start
  console.debug('[Middleware] End:', { duration, context })
}

/**
 * 内置中间件 - 性能监控
 */
export function performanceMiddleware<T>(threshold = 100) {
  return async (context: MiddlewareContext<T>, next: NextFunction): Promise<void> => {
    const start = performance.now()

    await next()

    const duration = performance.now() - start
    if (duration > threshold) {
      console.warn(`[Performance] Slow middleware execution: ${duration.toFixed(2)}ms`, context)
    }
  }
}

/**
 * 内置中间件 - 错误处理
 */
export function errorHandlingMiddleware<T>(
  errorHandler?: (error: Error, context: MiddlewareContext<T>) => void
) {
  return async (context: MiddlewareContext<T>, next: NextFunction): Promise<void> => {
    try {
      await next()
    } catch (error) {
      console.error('[Middleware] Error:', error, context)
      if (errorHandler) {
        errorHandler(error as Error, context)
      } else {
        throw error
      }
    }
  }
}

/**
 * 内置中间件 - 数据验证
 */
export function validationMiddleware<T>(
  validator: (data: T) => boolean,
  errorMessage = 'Validation failed'
) {
  return async (context: MiddlewareContext<T>, next: NextFunction): Promise<void> => {
    if (!validator(context.data)) {
      throw new Error(errorMessage)
    }
    await next()
  }
}

/**
 * 内置中间件 - 数据转换
 */
export function transformMiddleware<T, R>(
  transformer: (data: T) => R
): MiddlewareFunction<T> {
  return async (context: MiddlewareContext<T>, next: NextFunction): Promise<void> => {
    context.data = transformer(context.data) as T
    await next()
  }
}

/**
 * 内置中间件 - 缓存
 */
export function cacheMiddleware<T>(
  cache: Map<string, unknown>,
  keyGenerator: (context: MiddlewareContext<T>) => string
) {
  return async (context: MiddlewareContext<T>, next: NextFunction): Promise<void> => {
    const key = keyGenerator(context)

    if (cache.has(key)) {
      context.data = cache.get(key) as T
      return
    }

    await next()

    cache.set(key, context.data)
  }
}

/**
 * 内置中间件 - 节流
 */
export function throttleMiddleware<T>(delay = 100) {
  let lastExecutionTime = 0

  return async (context: MiddlewareContext<T>, next: NextFunction): Promise<void> => {
    const now = Date.now()

    if (now - lastExecutionTime < delay) {
      return
    }

    lastExecutionTime = now
    await next()
  }
}

/**
 * 内置中间件 - 防抖
 */
export function debounceMiddleware<T>(delay = 300) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return async (context: MiddlewareContext<T>, next: NextFunction): Promise<void> => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    return new Promise((resolve) => {
      timeoutId = setTimeout(async () => {
        await next()
        resolve()
      }, delay)
    })
  }
}

