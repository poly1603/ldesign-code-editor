<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900 mb-2">Composables</h1>
      <p class="text-slate-600">Use the useCodeEditor composable for more control.</p>
    </div>

    <DemoContainer 
      title="useCodeEditor Demo"
      :native-code="nativeCode"
      :vue-code="vueCode"
    >
      <template #native>
        <div class="space-y-4">
          <div ref="nativeContainer" class="h-64"></div>
          <div class="flex gap-2 flex-wrap">
            <button @click="nativeFormat" class="btn">Format</button>
            <button @click="nativeUndo" class="btn">Undo</button>
            <button @click="nativeRedo" class="btn">Redo</button>
            <button @click="nativeInsert" class="btn">Insert Text</button>
            <button @click="nativeScrollToTop" class="btn">Scroll to Top</button>
          </div>
        </div>
      </template>
      
      <template #vue>
        <div class="space-y-4">
          <div ref="vueContainer" class="h-64 border border-slate-200 rounded-lg overflow-hidden"></div>
          <div class="flex gap-2 flex-wrap">
            <button @click="format" class="btn" :disabled="!isReady">Format</button>
            <button @click="undo" class="btn" :disabled="!isReady">Undo</button>
            <button @click="redo" class="btn" :disabled="!isReady">Redo</button>
            <button @click="insertText" class="btn" :disabled="!isReady">Insert Text</button>
            <button @click="scrollToTop" class="btn" :disabled="!isReady">Scroll to Top</button>
          </div>
          <div class="text-sm text-slate-500">
            Status: {{ isReady ? 'Ready' : 'Loading...' }}
          </div>
        </div>
      </template>
    </DemoContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { createEditor, destroyEditor, type CodeEditorInstance } from '@ldesign/code-editor-core'
import { useCodeEditor } from '@ldesign/code-editor-vue'
import DemoContainer from '@/components/DemoContainer.vue'

const sampleCode = `// Sample code for composable demo
function processData(items) {
  return items
    .filter(item => item.active)
    .map(item => ({
      id: item.id,
      name: item.name.toUpperCase(),
      value: item.value * 2
    }))
    .sort((a, b) => a.value - b.value)
}

const data = [
  { id: 1, name: 'Alpha', value: 10, active: true },
  { id: 2, name: 'Beta', value: 5, active: false },
  { id: 3, name: 'Gamma', value: 15, active: true },
  { id: 4, name: 'Delta', value: 8, active: true }
]

const result = processData(data)
console.log(result)`

// Native JS approach
const nativeContainer = ref<HTMLElement | null>(null)
let nativeEditor: CodeEditorInstance | null = null

onMounted(() => {
  if (nativeContainer.value) {
    nativeEditor = createEditor({
      container: nativeContainer.value,
      value: sampleCode,
      language: 'javascript',
      theme: 'vs-dark'
    })
  }
})

onBeforeUnmount(() => {
  if (nativeEditor) {
    destroyEditor(nativeEditor)
  }
})

function nativeFormat() {
  nativeEditor?.format()
}

function nativeUndo() {
  nativeEditor?.undo()
}

function nativeRedo() {
  nativeEditor?.redo()
}

function nativeInsert() {
  nativeEditor?.insertText('\n// Inserted comment\n')
}

function nativeScrollToTop() {
  nativeEditor?.scrollToLine(1)
}

// Vue composable approach
const vueContainer = ref<HTMLElement | null>(null)

const { 
  isReady,
  format,
  undo,
  redo,
  getValue,
  setValue
} = useCodeEditor(vueContainer, {
  value: sampleCode,
  language: 'javascript',
  theme: 'vs-dark'
})

function insertText() {
  const current = getValue()
  setValue(current + '\n// Inserted via composable\n')
}

function scrollToTop() {
  // The composable would need a scrollToLine method
  // For now, we demonstrate the concept
  console.log('Scroll to top')
}

const nativeCode = `import { createEditor } from '@ldesign/code-editor-core'

const editor = createEditor({
  container: '#editor',
  value: code,
  language: 'javascript'
})

// Use editor methods
await editor.format()
editor.undo()
editor.redo()
editor.insertText('// New comment')
editor.scrollToLine(1)
editor.focus()
editor.blur()`

const vueCode = `<template>
  <div ref="container"></div>
  <button @click="format" :disabled="!isReady">Format</button>
</template>

<script setup>
import { ref } from 'vue'
import { useCodeEditor } from '@ldesign/code-editor-vue'

const container = ref(null)

const {
  editor,
  isReady,
  getValue,
  setValue,
  focus,
  blur,
  format,
  undo,
  redo,
  setLanguage,
  setTheme,
  layout,
  destroy
} = useCodeEditor(container, {
  value: '// Your code',
  language: 'javascript',
  theme: 'vs-dark'
})

// Access raw monaco editor if needed
// editor.value?.getMonacoEditor()
<\/script>`
</script>

<style scoped>
.btn {
  @apply px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>
