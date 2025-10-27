/**
 * 编辑器生命周期管理
 * 管理编辑器实例的创建、初始化、更新和销毁
 */

import type * as Monaco from 'monaco-editor'

export enum LifecyclePhase {
  Creating = 'creating',
  Initializing = 'initializing',
  Ready = 'ready',
  Updating = 'updating',
  Disposing = 'disposing',
  Disposed = 'disposed',
}

export type LifecycleHook = () => void | Promise<void>

export interface LifecycleHooks {
  beforeCreate?: LifecycleHook
  created?: LifecycleHook
  beforeMount?: LifecycleHook
  mounted?: LifecycleHook
  beforeUpdate?: LifecycleHook
  updated?: LifecycleHook
  beforeDispose?: LifecycleHook
  disposed?: LifecycleHook
}

/**
 * 编辑器生命周期管理器
 */
export class EditorLifecycle {
  private phase: LifecyclePhase = LifecyclePhase.Creating
  private hooks: LifecycleHooks = {}
  private eventListeners: Map<LifecyclePhase, Set<LifecycleHook>> = new Map()
  private editor: Monaco.editor.IStandaloneCodeEditor | null = null

  constructor(hooks?: LifecycleHooks) {
    if (hooks) {
      this.hooks = hooks
    }
  }

  /**
   * 获取当前生命周期阶段
   */
  getPhase(): LifecyclePhase {
    return this.phase
  }

  /**
   * 设置编辑器实例
   */
  setEditor(editor: Monaco.editor.IStandaloneCodeEditor): void {
    this.editor = editor
  }

  /**
   * 获取编辑器实例
   */
  getEditor(): Monaco.editor.IStandaloneCodeEditor | null {
    return this.editor
  }

  /**
   * 注册生命周期钩子
   */
  on(phase: LifecyclePhase, hook: LifecycleHook): () => void {
    if (!this.eventListeners.has(phase)) {
      this.eventListeners.set(phase, new Set())
    }
    this.eventListeners.get(phase)!.add(hook)

    // 返回取消注册函数
    return () => {
      this.eventListeners.get(phase)?.delete(hook)
    }
  }

  /**
   * 触发生命周期钩子
   */
  private async triggerHook(hookName: keyof LifecycleHooks, phase: LifecyclePhase): Promise<void> {
    // 触发注册的钩子
    const hook = this.hooks[hookName]
    if (hook) {
      await hook()
    }

    // 触发事件监听器
    const listeners = this.eventListeners.get(phase)
    if (listeners) {
      for (const listener of listeners) {
        await listener()
      }
    }
  }

  /**
   * 创建前
   */
  async beforeCreate(): Promise<void> {
    this.phase = LifecyclePhase.Creating
    await this.triggerHook('beforeCreate', LifecyclePhase.Creating)
  }

  /**
   * 创建后
   */
  async created(): Promise<void> {
    await this.triggerHook('created', LifecyclePhase.Creating)
  }

  /**
   * 挂载前
   */
  async beforeMount(): Promise<void> {
    this.phase = LifecyclePhase.Initializing
    await this.triggerHook('beforeMount', LifecyclePhase.Initializing)
  }

  /**
   * 挂载后
   */
  async mounted(): Promise<void> {
    this.phase = LifecyclePhase.Ready
    await this.triggerHook('mounted', LifecyclePhase.Ready)
  }

  /**
   * 更新前
   */
  async beforeUpdate(): Promise<void> {
    this.phase = LifecyclePhase.Updating
    await this.triggerHook('beforeUpdate', LifecyclePhase.Updating)
  }

  /**
   * 更新后
   */
  async updated(): Promise<void> {
    this.phase = LifecyclePhase.Ready
    await this.triggerHook('updated', LifecyclePhase.Ready)
  }

  /**
   * 销毁前
   */
  async beforeDispose(): Promise<void> {
    this.phase = LifecyclePhase.Disposing
    await this.triggerHook('beforeDispose', LifecyclePhase.Disposing)
  }

  /**
   * 销毁后
   */
  async disposed(): Promise<void> {
    this.phase = LifecyclePhase.Disposed
    await this.triggerHook('disposed', LifecyclePhase.Disposed)
    this.eventListeners.clear()
    this.editor = null
  }

  /**
   * 检查是否处于某个阶段
   */
  is(phase: LifecyclePhase): boolean {
    return this.phase === phase
  }

  /**
   * 检查是否已就绪
   */
  isReady(): boolean {
    return this.phase === LifecyclePhase.Ready
  }

  /**
   * 检查是否已销毁
   */
  isDisposed(): boolean {
    return this.phase === LifecyclePhase.Disposed
  }
}

/**
 * 生命周期装饰器工厂
 */
export function LifecycleDecorator(phase: LifecyclePhase) {
  return function (
    _target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value

    descriptor.value = async function (this: { lifecycle?: EditorLifecycle }, ...args: unknown[]) {
      if (this.lifecycle && !this.lifecycle.is(phase)) {
        console.warn(`Method called in wrong lifecycle phase. Expected: ${phase}`)
      }
      return await originalMethod.apply(this, args)
    }

    return descriptor
  }
}

