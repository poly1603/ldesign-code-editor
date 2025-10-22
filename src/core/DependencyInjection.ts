/**
 * 依赖注入容器
 * 实现服务注册、解析和生命周期管理
 */

export type ServiceLifetime = 'singleton' | 'transient' | 'scoped'

export interface ServiceDescriptor<T = unknown> {
  token: symbol | string
  factory: (container: DIContainer) => T
  lifetime: ServiceLifetime
  instance?: T
}

/**
 * 依赖注入容器类
 */
export class DIContainer {
  private services = new Map<symbol | string, ServiceDescriptor>()
  private scopedInstances = new Map<symbol | string, unknown>()

  /**
   * 注册服务
   */
  register<T>(
    token: symbol | string,
    factory: (container: DIContainer) => T,
    lifetime: ServiceLifetime = 'singleton'
  ): void {
    this.services.set(token, {
      token,
      factory,
      lifetime,
    })
  }

  /**
   * 注册单例服务
   */
  registerSingleton<T>(token: symbol | string, factory: (container: DIContainer) => T): void {
    this.register(token, factory, 'singleton')
  }

  /**
   * 注册瞬时服务
   */
  registerTransient<T>(token: symbol | string, factory: (container: DIContainer) => T): void {
    this.register(token, factory, 'transient')
  }

  /**
   * 注册作用域服务
   */
  registerScoped<T>(token: symbol | string, factory: (container: DIContainer) => T): void {
    this.register(token, factory, 'scoped')
  }

  /**
   * 解析服务
   */
  resolve<T>(token: symbol | string): T {
    const descriptor = this.services.get(token)

    if (!descriptor) {
      throw new Error(`Service not found: ${String(token)}`)
    }

    switch (descriptor.lifetime) {
      case 'singleton':
        if (!descriptor.instance) {
          descriptor.instance = descriptor.factory(this)
        }
        return descriptor.instance as T

      case 'scoped':
        if (!this.scopedInstances.has(token)) {
          this.scopedInstances.set(token, descriptor.factory(this))
        }
        return this.scopedInstances.get(token) as T

      case 'transient':
        return descriptor.factory(this) as T

      default:
        throw new Error(`Unknown service lifetime: ${descriptor.lifetime}`)
    }
  }

  /**
   * 尝试解析服务
   */
  tryResolve<T>(token: symbol | string): T | null {
    try {
      return this.resolve<T>(token)
    } catch {
      return null
    }
  }

  /**
   * 检查服务是否已注册
   */
  has(token: symbol | string): boolean {
    return this.services.has(token)
  }

  /**
   * 清理作用域实例
   */
  clearScope(): void {
    this.scopedInstances.clear()
  }

  /**
   * 创建子容器
   */
  createScope(): DIContainer {
    const scope = new DIContainer()
    // 复制服务定义
    this.services.forEach((descriptor, token) => {
      scope.services.set(token, { ...descriptor })
    })
    return scope
  }

  /**
   * 清理所有服务
   */
  dispose(): void {
    this.services.clear()
    this.scopedInstances.clear()
  }
}

// 全局容器实例
export const globalContainer = new DIContainer()

// 服务令牌
export const ServiceTokens = {
  EditorCore: Symbol('EditorCore'),
  PluginManager: Symbol('PluginManager'),
  ThemeManager: Symbol('ThemeManager'),
  FeatureManager: Symbol('FeatureManager'),
  LanguageService: Symbol('LanguageService'),
  AIService: Symbol('AIService'),
  CollaborationService: Symbol('CollaborationService'),
  FileSystemService: Symbol('FileSystemService'),
  DebugService: Symbol('DebugService'),
  SnippetManager: Symbol('SnippetManager'),
  ExtensionLoader: Symbol('ExtensionLoader'),
  PerformanceMonitor: Symbol('PerformanceMonitor'),
  MemoryManager: Symbol('MemoryManager'),
  CacheService: Symbol('CacheService'),
} as const

