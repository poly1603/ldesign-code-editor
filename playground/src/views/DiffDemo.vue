<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900 mb-2">Diff Editor</h1>
      <p class="text-slate-600">Compare two pieces of code side by side.</p>
    </div>

    <DemoContainer 
      title="Diff Editor"
      :native-code="nativeCode"
      :vue-code="vueCode"
    >
      <template #native>
        <div ref="nativeContainer" class="h-96"></div>
      </template>
      
      <template #vue>
        <DiffEditor
          :original="originalCode"
          v-model:modified="modifiedCode"
          language="javascript"
          theme="vs-dark"
          height="384px"
        />
      </template>
    </DemoContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as monaco from 'monaco-editor'
import { DiffEditor } from '@ldesign/code-editor-vue'
import DemoContainer from '@/components/DemoContainer.vue'

const originalCode = `function calculateTotal(items) {
  let total = 0
  for (let i = 0; i < items.length; i++) {
    total += items[i].price
  }
  return total
}

const items = [
  { name: 'Apple', price: 1.5 },
  { name: 'Banana', price: 0.75 },
  { name: 'Orange', price: 2.0 }
]

console.log(calculateTotal(items))`

const modifiedCode = ref(`function calculateTotal(items) {
  // Use reduce for cleaner code
  return items.reduce((total, item) => total + item.price, 0)
}

const items = [
  { name: 'Apple', price: 1.5 },
  { name: 'Banana', price: 0.75 },
  { name: 'Orange', price: 2.0 },
  { name: 'Mango', price: 3.0 }
]

const total = calculateTotal(items)
console.log(\`Total: $\${total.toFixed(2)}\`)`)

const nativeContainer = ref<HTMLElement | null>(null)
let diffEditor: monaco.editor.IStandaloneDiffEditor | null = null
let originalModel: monaco.editor.ITextModel | null = null
let modifiedModel: monaco.editor.ITextModel | null = null

onMounted(() => {
  if (nativeContainer.value) {
    originalModel = monaco.editor.createModel(originalCode, 'javascript')
    modifiedModel = monaco.editor.createModel(modifiedCode.value, 'javascript')

    diffEditor = monaco.editor.createDiffEditor(nativeContainer.value, {
      theme: 'vs-dark',
      automaticLayout: true,
      renderSideBySide: true
    })

    diffEditor.setModel({
      original: originalModel,
      modified: modifiedModel
    })
  }
})

onBeforeUnmount(() => {
  diffEditor?.dispose()
  originalModel?.dispose()
  modifiedModel?.dispose()
})

const nativeCode = `import * as monaco from 'monaco-editor'

const originalModel = monaco.editor.createModel(originalCode, 'javascript')
const modifiedModel = monaco.editor.createModel(modifiedCode, 'javascript')

const diffEditor = monaco.editor.createDiffEditor(container, {
  theme: 'vs-dark',
  automaticLayout: true,
  renderSideBySide: true
})

diffEditor.setModel({
  original: originalModel,
  modified: modifiedModel
})`

const vueCode = `<template>
  <DiffEditor
    :original="originalCode"
    v-model:modified="modifiedCode"
    language="javascript"
    theme="vs-dark"
    height="400px"
  />
</template>

<script setup>
import { ref } from 'vue'
import { DiffEditor } from '@ldesign/code-editor-vue'

const originalCode = \`// Original code\`
const modifiedCode = ref(\`// Modified code\`)
<\/script>`
</script>
