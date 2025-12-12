<template>
  <div ref="containerRef" class="code-editor-container" :style="containerStyle"></div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import type { CodeEditorOptions, CodeEditorInstance } from '@ldesign/code-editor-core'
import { createEditor, destroyEditor } from '@ldesign/code-editor-core'

export interface CodeEditorProps {
  modelValue?: string
  language?: string
  theme?: string
  readOnly?: boolean
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval'
  minimap?: boolean
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded'
  fontSize?: number
  fontFamily?: string
  tabSize?: number
  placeholder?: string
  height?: string | number
  width?: string | number
  options?: Partial<CodeEditorOptions>
}

const props = withDefaults(defineProps<CodeEditorProps>(), {
  modelValue: '',
  language: 'javascript',
  theme: 'vs',
  readOnly: false,
  lineNumbers: 'on',
  minimap: true,
  wordWrap: 'off',
  fontSize: 14,
  tabSize: 2,
  height: '300px',
  width: '100%'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
  'focus': []
  'blur': []
  'save': [value: string]
  'ready': [editor: CodeEditorInstance]
}>()

const containerRef = ref<HTMLElement | null>(null)
let editorInstance: CodeEditorInstance | null = null
let isUpdatingFromProp = false

const containerStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  width: typeof props.width === 'number' ? `${props.width}px` : props.width
}))

const initEditor = async () => {
  if (!containerRef.value) return

  await nextTick()

  const options: CodeEditorOptions = {
    container: containerRef.value,
    value: props.modelValue,
    language: props.language,
    theme: props.theme,
    readOnly: props.readOnly,
    lineNumbers: props.lineNumbers,
    minimap: props.minimap,
    wordWrap: props.wordWrap,
    fontSize: props.fontSize,
    fontFamily: props.fontFamily,
    tabSize: props.tabSize,
    placeholder: props.placeholder,
    ...props.options
  }

  editorInstance = createEditor(options)

  // Event bindings
  editorInstance.on('change', (value) => {
    if (isUpdatingFromProp) return
    emit('update:modelValue', value)
    emit('change', value)
  })

  editorInstance.on('focus', () => {
    emit('focus')
  })

  editorInstance.on('blur', () => {
    emit('blur')
  })

  editorInstance.on('save', (value) => {
    emit('save', value)
  })

  emit('ready', editorInstance)
}

// Watch modelValue
watch(() => props.modelValue, (newValue) => {
  if (!editorInstance || editorInstance.getValue() === newValue) return
  isUpdatingFromProp = true
  editorInstance.setValue(newValue)
  isUpdatingFromProp = false
})

// Watch language
watch(() => props.language, (newValue) => {
  editorInstance?.setLanguage(newValue)
})

// Watch theme
watch(() => props.theme, (newValue) => {
  editorInstance?.setTheme(newValue)
})

// Watch other options
watch(() => ({
  readOnly: props.readOnly,
  lineNumbers: props.lineNumbers,
  minimap: props.minimap,
  wordWrap: props.wordWrap,
  fontSize: props.fontSize,
  fontFamily: props.fontFamily,
  tabSize: props.tabSize
}), (newOptions) => {
  editorInstance?.updateOptions(newOptions)
}, { deep: true })

onMounted(() => {
  initEditor()
})

onBeforeUnmount(() => {
  if (editorInstance) {
    destroyEditor(editorInstance)
    editorInstance = null
  }
})

// Expose editor instance
defineExpose({
  getEditor: () => editorInstance,
  getValue: () => editorInstance?.getValue() ?? '',
  setValue: (value: string) => editorInstance?.setValue(value),
  focus: () => editorInstance?.focus(),
  blur: () => editorInstance?.blur(),
  format: () => editorInstance?.format(),
  undo: () => editorInstance?.undo(),
  redo: () => editorInstance?.redo(),
  layout: () => editorInstance?.layout()
})
</script>

<style>
.code-editor-container {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}
</style>
