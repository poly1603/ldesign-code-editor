<template>
  <div ref="containerRef" class="ldesign-code-editor" :class="containerClass">
    <div v-if="loading && showLoading" class="ldesign-code-editor__loading">
      <slot name="loading">
        <div class="ldesign-code-editor__spinner"></div>
        <div class="ldesign-code-editor__loading-text">{{ loadingText }}</div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { createCodeEditor, type CodeEditor as CoreCodeEditor, type CodeEditorConfig } from '@ldesign/code-editor-core'
import type * as Monaco from 'monaco-editor'

export interface CodeEditorProps {
  modelValue?: string
  language?: string
  theme?: string
  readOnly?: boolean
  autoComplete?: boolean
  folding?: boolean
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval'
  minimap?: boolean
  fontSize?: number
  tabSize?: number
  insertSpaces?: boolean
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded'
  showLoading?: boolean
  loadingText?: string
  options?: Partial<Monaco.editor.IStandaloneEditorConstructionOptions>
  containerClass?: string | string[] | Record<string, boolean>
}

export interface CodeEditorEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'ready', editor: CoreCodeEditor): void
  (e: 'focus'): void
  (e: 'blur'): void
  (e: 'cursorChange', position: Monaco.Position): void
}

const props = withDefaults(defineProps<CodeEditorProps>(), {
  modelValue: '',
  language: 'javascript',
  theme: 'vs-dark',
  readOnly: false,
  autoComplete: true,
  folding: true,
  lineNumbers: 'on',
  minimap: true,
  fontSize: 14,
  tabSize: 2,
  insertSpaces: true,
  wordWrap: 'off',
  showLoading: false,
  loadingText: '加载编辑器中...'
})

const emit = defineEmits<CodeEditorEmits>()

const containerRef = ref<HTMLElement>()
const editor = ref<CoreCodeEditor>()
const loading = ref(true)

// 内部值，用于防止循环更新
let internalValue = props.modelValue

onMounted(async () => {
  if (!containerRef.value) return

  try {
    loading.value = true

    const config: CodeEditorConfig = {
      language: props.language,
      theme: props.theme,
      value: props.modelValue,
      readOnly: props.readOnly,
      autoComplete: props.autoComplete,
      folding: props.folding,
      lineNumbers: props.lineNumbers,
      minimap: props.minimap,
      fontSize: props.fontSize,
      tabSize: props.tabSize,
      insertSpaces: props.insertSpaces,
      wordWrap: props.wordWrap,
      monacoOptions: props.options,
      on: {
        ready: (ed) => {
          emit('ready', editor.value!)
        },
        change: (value) => {
          if (value !== internalValue) {
            internalValue = value
            emit('update:modelValue', value)
            emit('change', value)
          }
        },
        focus: () => {
          emit('focus')
        },
        blur: () => {
          emit('blur')
        },
        cursorChange: (position) => {
          emit('cursorChange', position)
        }
      }
    }

    editor.value = createCodeEditor(containerRef.value, config)

    // 延迟隐藏 loading
    setTimeout(() => {
      loading.value = false
    }, 300)
  } catch (error) {
    console.error('Failed to initialize editor:', error)
    loading.value = false
  }
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.dispose()
    editor.value = undefined
  }
})

// 监听 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  if (editor.value && newValue !== internalValue) {
    internalValue = newValue
    editor.value.setValue(newValue)
  }
})

// 监听其他属性变化
watch(() => props.language, (newValue) => {
  if (editor.value && newValue) {
    editor.value.setLanguage(newValue as any)
  }
})

watch(() => props.theme, (newValue) => {
  if (editor.value && newValue) {
    editor.value.setTheme(newValue as any)
  }
})

watch(() => props.readOnly, (newValue) => {
  if (editor.value) {
    editor.value.setReadOnly(newValue)
  }
})

watch(() => props.fontSize, (newValue) => {
  if (editor.value && newValue) {
    editor.value.updateOptions({ fontSize: newValue })
  }
})

// 暴露编辑器实例方法
defineExpose({
  editor,
  getValue: () => editor.value?.getValue() || '',
  setValue: (value: string) => editor.value?.setValue(value),
  getSelection: () => editor.value?.getSelection() || '',
  setSelection: (selection: Monaco.IRange) => editor.value?.setSelection(selection),
  insertText: (text: string, position?: Monaco.IPosition) => editor.value?.insertText(text, position),
  format: () => editor.value?.format(),
  setLanguage: (language: string) => editor.value?.setLanguage(language as any),
  setTheme: (theme: string) => editor.value?.setTheme(theme as any),
  setReadOnly: (readOnly: boolean) => editor.value?.setReadOnly(readOnly),
  focus: () => editor.value?.focus(),
  getPosition: () => editor.value?.getPosition(),
  setPosition: (position: Monaco.IPosition) => editor.value?.setPosition(position),
  undo: () => editor.value?.undo(),
  redo: () => editor.value?.redo(),
  getEditor: () => editor.value?.getEditor(),
  layout: (dimension?: Monaco.editor.IDimension) => editor.value?.layout(dimension)
})
</script>

<style scoped>
.ldesign-code-editor {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;
  overflow: hidden;
}

.ldesign-code-editor__loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(30, 30, 30, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: opacity 0.3s ease;
}

.ldesign-code-editor__spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: ldesign-spin 0.8s linear infinite;
}

@keyframes ldesign-spin {
  to {
    transform: rotate(360deg);
  }
}

.ldesign-code-editor__loading-text {
  margin-top: 20px;
  color: #fff;
  font-size: 14px;
}
</style>

