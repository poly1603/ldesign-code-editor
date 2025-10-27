/**
 * 懒加载管理器
 * 实现按需加载语言、主题和插件
 */

import { LRUCache } from '../utils/cache'

export interface LoaderOptions {
  retries?: number
  timeout?: number
  cache?: boolean
}

export type LoaderFunction<T> = () => Promise<T>

/**
 * 懒加载管理器
 */
export class LazyLoader {
  private cache = new LRUCache<unknown>({ maxSize: 50 })
  private loading = new Map<string, Promise<unknown>>()
  private loaded = new Set<string>()

  /**
   * 加载资源
   */
  async load<T>(
    key: string,
    loader: LoaderFunction<T>,
    options: LoaderOptions = {}
  ): Promise<T> {
    const { retries = 3, timeout = 10000, cache = true } = options

    // 检查缓存
    if (cache && this.cache.has(key)) {
      return this.cache.get(key) as T
    }

    // 检查是否正在加载
    if (this.loading.has(key)) {
      return this.loading.get(key) as Promise<T>
    }

    // 开始加载
    const loadPromise = this.loadWithRetry(loader, retries, timeout)

    this.loading.set(key, loadPromise)

    try {
      const result = await loadPromise

      // 缓存结果
      if (cache) {
        this.cache.set(key, result)
      }

      this.loaded.add(key)
      return result
    } finally {
      this.loading.delete(key)
    }
  }

  /**
   * 带重试的加载
   */
  private async loadWithRetry<T>(
    loader: LoaderFunction<T>,
    retries: number,
    timeout: number
  ): Promise<T> {
    let lastError: Error | null = null

    for (let i = 0; i <= retries; i++) {
      try {
        return await this.withTimeout(loader(), timeout)
      } catch (error) {
        lastError = error as Error
        if (i < retries) {
          await this.delay(Math.pow(2, i) * 1000) // 指数退避
        }
      }
    }

    throw lastError || new Error('Load failed after retries')
  }

  /**
   * 超时控制
   */
  private withTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Load timeout')), timeout)
      ),
    ])
  }

  /**
   * 延迟
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * 检查是否已加载
   */
  isLoaded(key: string): boolean {
    return this.loaded.has(key)
  }

  /**
   * 预加载
   */
  async preload<T>(key: string, loader: LoaderFunction<T>, options?: LoaderOptions): Promise<void> {
    if (this.isLoaded(key)) {
      return
    }

    // 使用 requestIdleCallback 在空闲时加载
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(
        () => {
          this.load(key, loader, options).catch((error) => {
            console.warn(`Preload failed for ${key}:`, error)
          })
        },
        { timeout: 5000 }
      )
    } else {
      // 降级到 setTimeout
      setTimeout(() => {
        this.load(key, loader, options).catch((error) => {
          console.warn(`Preload failed for ${key}:`, error)
        })
      }, 100)
    }
  }

  /**
   * 批量预加载
   */
  async preloadBatch(
    items: Array<{ key: string; loader: LoaderFunction<unknown>; options?: LoaderOptions }>
  ): Promise<void> {
    const promises = items.map((item) => this.preload(item.key, item.loader, item.options))
    await Promise.allSettled(promises)
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * 重置
   */
  reset(): void {
    this.cache.clear()
    this.loading.clear()
    this.loaded.clear()
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      cached: this.cache.size(),
      loading: this.loading.size,
      loaded: this.loaded.size,
      cacheStats: this.cache.getStats(),
    }
  }
}

/**
 * 语言懒加载器
 */
export class LanguageLazyLoader extends LazyLoader {
  /**
   * 加载语言支持
   */
  async loadLanguage(language: string): Promise<void> {
    const key = `language:${language}`

    if (this.isLoaded(key)) {
      return
    }

    await this.load(key, async () => {
      switch (language) {
        case 'typescript':
        case 'javascript':
          return import('monaco-editor/esm/vs/language/typescript/monaco.contribution')

        case 'json':
          return import('monaco-editor/esm/vs/language/json/monaco.contribution')

        case 'html':
          return import('monaco-editor/esm/vs/language/html/monaco.contribution')

        case 'css':
        case 'scss':
        case 'less':
          return import('monaco-editor/esm/vs/language/css/monaco.contribution')

        default:
          console.warn(`Language ${language} not supported for lazy loading`)
          return null
      }
    })
  }

  /**
   * 预加载常用语言
   */
  async preloadCommonLanguages(): Promise<void> {
    const commonLanguages = ['typescript', 'javascript', 'json', 'html', 'css']

    await this.preloadBatch(
      commonLanguages.map((lang) => ({
        key: `language:${lang}`,
        loader: () => this.loadLanguage(lang),
      }))
    )
  }
}

/**
 * 主题懒加载器
 */
export class ThemeLazyLoader extends LazyLoader {
  /**
   * 加载主题
   */
  async loadTheme(themeName: string): Promise<unknown> {
    const key = `theme:${themeName}`

    return this.load(key, async () => {
      // 这里可以实现从 CDN 或服务器加载主题
      console.debug(`Loading theme: ${themeName}`)
      return null
    })
  }
}

/**
 * 插件懒加载器
 */
export class PluginLazyLoader extends LazyLoader {
  /**
   * 加载插件
   */
  async loadPlugin(pluginName: string): Promise<unknown> {
    const key = `plugin:${pluginName}`

    return this.load(key, async () => {
      // 这里可以实现动态导入插件
      console.debug(`Loading plugin: ${pluginName}`)
      return null
    })
  }
}

// 导出默认实例
export const languageLoader = new LanguageLazyLoader()
export const themeLoader = new ThemeLazyLoader()
export const pluginLoader = new PluginLazyLoader()

