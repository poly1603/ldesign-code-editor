/**
 * 核心功能测试
 */

import { describe, it, expect } from 'vitest'
import { DIContainer } from '../../src/core/DependencyInjection'
import { EditorLifecycle, LifecyclePhase } from '../../src/core/EditorLifecycle'
import { MiddlewareManager } from '../../src/core/Middleware'

describe('DependencyInjection', () => {
  it('should register and resolve singleton service', () => {
    const container = new DIContainer()
    const token = Symbol('TestService')

    container.registerSingleton(token, () => ({ value: 42 }))

    const service1 = container.resolve(token)
    const service2 = container.resolve(token)

    expect(service1).toBe(service2)
  })

  it('should resolve transient service', () => {
    const container = new DIContainer()
    const token = Symbol('TestService')

    container.registerTransient(token, () => ({ value: Math.random() }))

    const service1 = container.resolve(token)
    const service2 = container.resolve(token)

    expect(service1).not.toBe(service2)
  })
})

describe('EditorLifecycle', () => {
  it('should execute lifecycle hooks', async () => {
    let created = false
    let mounted = false

    const lifecycle = new EditorLifecycle({
      created: async () => { created = true },
      mounted: async () => { mounted = true },
    })

    await lifecycle.created()
    await lifecycle.mounted()

    expect(created).toBe(true)
    expect(mounted).toBe(true)
    expect(lifecycle.isReady()).toBe(true)
  })
})

describe('MiddlewareManager', () => {
  it('should execute middleware chain', async () => {
    const manager = new MiddlewareManager()
    const calls: number[] = []

    manager.use(async (ctx, next) => {
      calls.push(1)
      await next()
      calls.push(4)
    })

    manager.use(async (ctx, next) => {
      calls.push(2)
      await next()
      calls.push(3)
    })

    await manager.execute({ data: {}, editor: null, timestamp: Date.now() })

    expect(calls).toEqual([1, 2, 3, 4])
  })
})

