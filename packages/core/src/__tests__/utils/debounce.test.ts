import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce, throttle, rafThrottle, delay, retry } from '../../utils/debounce'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('应该延迟函数执行', () => {
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 100)

    debouncedFn()
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(50)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('应该合并多次调用', () => {
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 100)

    debouncedFn()
    debouncedFn()
    debouncedFn()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('应该传递参数', () => {
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 100)

    debouncedFn('arg1', 'arg2')

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
  })
})

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('应该限制函数调用频率', () => {
    const fn = vi.fn()
    const throttledFn = throttle(fn, 100)

    throttledFn()
    throttledFn()
    throttledFn()

    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)
    throttledFn()

    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('应该传递最新的参数', () => {
    const fn = vi.fn()
    const throttledFn = throttle(fn, 100)

    throttledFn('arg1')
    expect(fn).toHaveBeenCalledWith('arg1')

    throttledFn('arg2')
    vi.advanceTimersByTime(100)
    throttledFn('arg3')

    expect(fn).toHaveBeenLastCalledWith('arg3')
  })
})

describe('delay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('应该延迟指定时间', async () => {
    const promise = delay(1000)

    vi.advanceTimersByTime(500)
    // Promise 应该还未 resolve

    vi.advanceTimersByTime(500)
    await promise
    // Promise 应该已 resolve
  })
})

describe('retry', () => {
  it('应该在失败时重试', async () => {
    let attempts = 0
    const fn = vi.fn(async () => {
      attempts++
      if (attempts < 3) {
        throw new Error('Failed')
      }
      return 'success'
    })

    const result = await retry(fn, 3, 0)

    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('应该在达到最大重试次数后抛出错误', async () => {
    const fn = vi.fn(async () => {
      throw new Error('Always fails')
    })

    await expect(retry(fn, 3, 0)).rejects.toThrow('Always fails')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('应该在首次成功时不重试', async () => {
    const fn = vi.fn(async () => 'success')

    const result = await retry(fn, 3, 0)

    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
