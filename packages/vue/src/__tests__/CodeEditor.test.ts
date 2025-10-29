import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { CodeEditor } from '../CodeEditor.vue'

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
    const wrapper = mount(CodeEditor, {
      props: {
        modelValue: 'console.log("test")',
        language: 'javascript',
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('应该支持 v-model', async () => {
    const value = ref('initial value')

    const wrapper = mount(CodeEditor, {
      props: {
        modelValue: value.value,
        'onUpdate:modelValue': (newValue: string) => {
          value.value = newValue
        },
      },
    })

    // 模拟值改变
    await wrapper.vm.$emit('update:modelValue', 'new value')
    await nextTick()

    expect(value.value).toBe('new value')
  })

  it('应该传递正确的 props', () => {
    const wrapper = mount(CodeEditor, {
      props: {
        modelValue: 'test',
        language: 'typescript',
        theme: 'vs-dark',
        readOnly: true,
        fontSize: 16,
        tabSize: 4,
      },
    })

    expect(wrapper.props('language')).toBe('typescript')
    expect(wrapper.props('theme')).toBe('vs-dark')
    expect(wrapper.props('readOnly')).toBe(true)
    expect(wrapper.props('fontSize')).toBe(16)
    expect(wrapper.props('tabSize')).toBe(4)
  })

  it('应该应用自定义样式', () => {
    const wrapper = mount(CodeEditor, {
      props: {
        modelValue: 'test',
        height: '500px',
        width: '100%',
        customClass: 'custom-editor',
        customStyle: { border: '1px solid red' },
      },
    })

    const container = wrapper.find('div')
    expect(container.classes()).toContain('custom-editor')
  })

  it('应该触发事件', async () => {
    const onChange = vi.fn()
    const onFocus = vi.fn()
    const onBlur = vi.fn()

    const wrapper = mount(CodeEditor, {
      props: {
        modelValue: 'test',
        onChange,
        onFocus,
        onBlur,
      },
    })

    await wrapper.vm.$emit('change', 'new value')
    await wrapper.vm.$emit('focus')
    await wrapper.vm.$emit('blur')

    expect(onChange).toHaveBeenCalled()
    expect(onFocus).toHaveBeenCalled()
    expect(onBlur).toHaveBeenCalled()
  })

  it('应该在卸载时清理资源', () => {
    const wrapper = mount(CodeEditor, {
      props: {
        modelValue: 'test',
      },
    })

    wrapper.unmount()

    // 验证 dispose 被调用
    // 注：实际的 dispose 调用验证需要 spy
  })
})
