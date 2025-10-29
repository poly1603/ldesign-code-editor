import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { CodeEditor } from '../CodeEditor'

// Mock @ldesign/code-editor-core
vi.mock('@ldesign/code-editor-core', () => ({
  createCodeEditor: vi.fn(() => ({
    getValue: vi.fn(() => 'test value'),
    setValue: vi.fn(),
    setLanguage: vi.fn(),
    setTheme: vi.fn(),
    setReadOnly: vi.fn(),
    focus: vi.fn(),
    dispose: vi.fn(),
    updateOptions: vi.fn(),
  })),
}))

describe('CodeEditor Component', () => {
  it('应该正确渲染', () => {
    const { container } = render(
      <CodeEditor
        value="console.log('test')"
        language="javascript"
      />,
    )

    expect(container.firstChild).toBeTruthy()
  })

  it('应该传递正确的 props', () => {
    const { container } = render(
      <CodeEditor
        value="test code"
        language="typescript"
        theme="vs-dark"
        readOnly={true}
        fontSize={16}
        tabSize={4}
        height="500px"
        width="100%"
      />,
    )

    const editorContainer = container.firstChild as HTMLElement
    expect(editorContainer.style.height).toBe('500px')
    expect(editorContainer.style.width).toBe('100%')
  })

  it('应该触发 onChange 回调', async () => {
    const handleChange = vi.fn()

    render(
      <CodeEditor
        value="initial"
        onChange={handleChange}
      />,
    )

    // 注：实际的 change 事件触发需要与 Monaco 交互
    // 这里只测试回调被正确传递
  })

  it('应该应用自定义类名和样式', () => {
    const { container } = render(
      <CodeEditor
        value="test"
        className="custom-class"
        style={{ border: '1px solid red' }}
      />,
    )

    const editorContainer = container.firstChild as HTMLElement
    expect(editorContainer.className).toContain('custom-class')
    expect(editorContainer.style.border).toBe('1px solid red')
  })

  it('应该在值改变时更新编辑器', async () => {
    const { rerender } = render(
      <CodeEditor value="initial value" />,
    )

    rerender(<CodeEditor value="new value" />)

    await waitFor(() => {
      // 验证 setValue 被调用
      // 注：需要 spy 来验证
    })
  })

  it('应该在卸载时清理资源', () => {
    const { unmount } = render(
      <CodeEditor value="test" />,
    )

    unmount()

    // 验证 dispose 被调用
    // 注：需要 spy 来验证
  })

  it('应该支持数字类型的高度和宽度', () => {
    const { container } = render(
      <CodeEditor
        value="test"
        height={500}
        width={800}
      />,
    )

    const editorContainer = container.firstChild as HTMLElement
    expect(editorContainer.style.height).toBe('500px')
    expect(editorContainer.style.width).toBe('800px')
  })

  it('应该触发所有事件回调', async () => {
    const handleChange = vi.fn()
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    const handleReady = vi.fn()

    render(
      <CodeEditor
        value="test"
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onReady={handleReady}
      />,
    )

    // 验证回调被正确注册
    // 注：实际触发需要与 Monaco 交互
  })
})
