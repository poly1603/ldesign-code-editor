<template>
  <div ref="containerRef" class="diff-editor-container" :style="containerStyle"></div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as monaco from 'monaco-editor'

export interface DiffEditorProps {
  original?: string
  modified?: string
  language?: string
  theme?: string
  readOnly?: boolean
  renderSideBySide?: boolean
  height?: string | number
  width?: string | number
}

const props = withDefaults(defineProps<DiffEditorProps>(), {
  original: '',
  modified: '',
  language: 'javascript',
  theme: 'vs',
  readOnly: false,
  renderSideBySide: true,
  height: '400px',
  width: '100%'
})

const emit = defineEmits<{
  'update:modified': [value: string]
  'change': [value: string]
  'ready': [editor: monaco.editor.IStandaloneDiffEditor]
}>()

const containerRef = ref<HTMLElement | null>(null)
let diffEditor: monaco.editor.IStandaloneDiffEditor | null = null
let originalModel: monaco.editor.ITextModel | null = null
let modifiedModel: monaco.editor.ITextModel | null = null

const containerStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  width: typeof props.width === 'number' ? `${props.width}px` : props.width
}))

const initEditor = async () => {
  if (!containerRef.value) return

  await nextTick()

  originalModel = monaco.editor.createModel(props.original, props.language)
  modifiedModel = monaco.editor.createModel(props.modified, props.language)

  diffEditor = monaco.editor.createDiffEditor(containerRef.value, {
    theme: props.theme,
    readOnly: props.readOnly,
    renderSideBySide: props.renderSideBySide,
    automaticLayout: true,
    scrollbar: {
      useShadows: false,
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10
    }
  })

  diffEditor.setModel({
    original: originalModel,
    modified: modifiedModel
  })

  // Listen to modified content changes
  modifiedModel.onDidChangeContent(() => {
    const value = modifiedModel?.getValue() ?? ''
    emit('update:modified', value)
    emit('change', value)
  })

  emit('ready', diffEditor)
}

// Watch original
watch(() => props.original, (newValue) => {
  if (originalModel && originalModel.getValue() !== newValue) {
    originalModel.setValue(newValue)
  }
})

// Watch modified
watch(() => props.modified, (newValue) => {
  if (modifiedModel && modifiedModel.getValue() !== newValue) {
    modifiedModel.setValue(newValue)
  }
})

// Watch language
watch(() => props.language, (newValue) => {
  if (originalModel) monaco.editor.setModelLanguage(originalModel, newValue)
  if (modifiedModel) monaco.editor.setModelLanguage(modifiedModel, newValue)
})

// Watch theme
watch(() => props.theme, (newValue) => {
  monaco.editor.setTheme(newValue)
})

// Watch options
watch(() => ({
  readOnly: props.readOnly,
  renderSideBySide: props.renderSideBySide
}), (newOptions) => {
  diffEditor?.updateOptions(newOptions)
}, { deep: true })

onMounted(() => {
  initEditor()
})

onBeforeUnmount(() => {
  diffEditor?.dispose()
  originalModel?.dispose()
  modifiedModel?.dispose()
  diffEditor = null
  originalModel = null
  modifiedModel = null
})

// Expose editor instance
defineExpose({
  getEditor: () => diffEditor,
  getOriginalValue: () => originalModel?.getValue() ?? '',
  getModifiedValue: () => modifiedModel?.getValue() ?? '',
  setOriginalValue: (value: string) => originalModel?.setValue(value),
  setModifiedValue: (value: string) => modifiedModel?.setValue(value),
  layout: () => diffEditor?.layout()
})
</script>

<style>
.diff-editor-container {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}
</style>
