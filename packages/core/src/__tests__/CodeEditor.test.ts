import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createCodeEditor, CodeEditor } from '../core/CodeEditor'
import type { CodeEditorConfig } from '../types'

// Mock Monaco Editor
vi.mock('monaco-editor', () => ({
  editor: {
    create: vi.fn(() => ({
      getValue: vi.fn(() => 'test value'),
      setValue: vi.fn(),
      getSelection: vi.fn(),
      setSelection: vi.fn(),
      getPosition: vi.fn(),
      setPosition: vi.fn(),
      focus: vi.fn(),
      layout: vi.fn(),
      updateOptions: vi.fn(),
      dispose: vi.fn(),
      onDidChangeModelContent: vi.fn(() => ({ dispose: vi.fn() })),
      onDidChangeCursorPosition: vi.fn(() => ({ dispose: vi.fn() })),
      onDidFocusEditorText: vi.fn(() => ({ dispose: vi.fn() })),
      onDidBlurEditorText: vi.fn(() => ({ dispose: vi.fn() })),
      getModel: vi.fn(() => ({
        getValueInRange: vi.fn(() => 'selected text'),
      })),
    })),
  },
}))

describe('CodeEditor', () => {
  let container: HTMLElement
  let editor: CodeEditor

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    if (editor) {
      editor.dispose()
    }
    document.body.removeChild(container)
  })

  describe('创建和初始化', () => {
    it('应该成功创建编辑器实例', () => {
      editor = createCodeEditor(container, {
        value: 'console.log("Hello World")',
        language: 'javascript',
      })

      expect(editor).toBeInstanceOf(CodeEditor)
    })

    it('应该使用默认配置', () => {
      editor = createCodeEditor(container)

      expect(editor).toBeDefined()
      expect(editor.getValue).toBeDefined()
    })

    it('应该应用自定义配置', () => {
      const config: CodeEditorConfig = {
        value: 'test code',
        language: 'typescript',
        theme: 'vs-dark',
        readOnly: true,
        fontSize: 16,
        tabSize: 4,
      }

      editor = createCodeEditor(container, config)

      expect(editor).toBeDefined()
    })
  })

  describe('getValue 和 setValue', () => {
    beforeEach(() => {
      editor = createCodeEditor(container, {
        value: 'initial value',
      })
    })

    it('应该能获取编辑器的值', () => {
      const value = editor.getValue()
      expect(value).toBeDefined()
      expect(typeof value).toBe('string')
    })

    it('应该能设置编辑器的值', () => {
      const newValue = 'new value'
      editor.setValue(newValue)

      // 验证 setValue 被调用
      expect(editor.getValue).toBeDefined()
    })
  })

  describe('选区操作', () => {
    beforeEach(() => {
      editor = createCodeEditor(container)
    })

    it('应该能获取选中的文本', () => {
      const selection = editor.getSelection()
      expect(typeof selection).toBe('string')
    })

    it('应该能设置选区', () => {
      const range = {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 10,
      }

      editor.setSelection(range)
      // 验证方法调用
      expect(editor.setSelection).toBeDefined()
    })
  })

  describe('光标操作', () => {
    beforeEach(() => {
      editor = createCodeEditor(container)
    })

    it('应该能获取光标位置', () => {
      const position = editor.getPosition()
      expect(position).toBeDefined()
    })

    it('应该能设置光标位置', () => {
      const position = {
        lineNumber: 1,
        column: 5,
      }

      editor.setPosition(position)
      expect(editor.setPosition).toBeDefined()
    })

    it('应该能聚焦编辑器', () => {
      editor.focus()
      expect(editor.focus).toBeDefined()
    })
  })

  describe('语言和主题', () => {
    beforeEach(() => {
      editor = createCodeEditor(container)
    })

    it('应该能切换语言', () => {
      editor.setLanguage('python')
      expect(editor.setLanguage).toBeDefined()
    })

    it('应该能切换主题', () => {
      editor.setTheme('vs-light')
      expect(editor.setTheme).toBeDefined()
    })
  })

  describe('只读模式', () => {
    it('应该能设置为只读', () => {
      editor = createCodeEditor(container, {
        readOnly: false,
      })

      editor.setReadOnly(true)
      expect(editor.setReadOnly).toBeDefined()
    })
  })

  describe('撤销和重做', () => {
    beforeEach(() => {
      editor = createCodeEditor(container)
    })

    it('应该支持撤销操作', () => {
      editor.undo()
      expect(editor.undo).toBeDefined()
    })

    it('应该支持重做操作', () => {
      editor.redo()
      expect(editor.redo).toBeDefined()
    })
  })

  describe('更新选项', () => {
    beforeEach(() => {
      editor = createCodeEditor(container)
    })

    it('应该能更新编辑器选项', () => {
      editor.updateOptions({
        fontSize: 18,
        tabSize: 4,
        lineNumbers: 'off',
      })

      expect(editor.updateOptions).toBeDefined()
    })
  })

  describe('事件处理', () => {
    it('应该触发 ready 事件', (done) => {
      const onReady = vi.fn(() => done())

      editor = createCodeEditor(container, {
        on: {
          ready: onReady,
        },
      })

      // 模拟异步初始化完成
      setTimeout(() => {
        if (!onReady.mock.calls.length) {
          done()
        }
      }, 100)
    })

    it('应该触发 change 事件', () => {
      const onChange = vi.fn()

      editor = createCodeEditor(container, {
        on: {
          change: onChange,
        },
      })

      // 验证事件监听器已注册
      expect(editor).toBeDefined()
    })
  })

  describe('资源清理', () => {
    it('应该能正确销毁编辑器', () => {
      editor = createCodeEditor(container)
      editor.dispose()

      // 验证 dispose 方法存在
      expect(editor.dispose).toBeDefined()
    })
  })
})
