<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900 mb-2">Basic Usage</h1>
      <p class="text-slate-600">Simple code editor with default settings.</p>
    </div>

    <DemoContainer 
      title="Basic Editor"
      :native-code="nativeCode"
      :vue-code="vueCode"
    >
      <template #native>
        <div ref="nativeContainer" class="h-80"></div>
      </template>
      
      <template #vue>
        <CodeEditor
          v-model="code"
          language="javascript"
          theme="vs"
          height="320px"
          @change="onVueChange"
        />
        <div class="mt-4 p-3 bg-slate-100 rounded-lg">
          <div class="text-xs text-slate-500 mb-1">Current Value:</div>
          <pre class="text-sm text-slate-700 whitespace-pre-wrap">{{ code }}</pre>
        </div>
      </template>
    </DemoContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { createEditor, destroyEditor, type CodeEditorInstance } from '@ldesign/code-editor-core'
import { CodeEditor } from '@ldesign/code-editor-vue'
import DemoContainer from '@/components/DemoContainer.vue'

const defaultCode = `// Welcome to the Code Editor!
function greet(name) {
  console.log(\`Hello, \${name}!\`)
}

greet('World')`

const code = ref(defaultCode)
const nativeContainer = ref<HTMLElement | null>(null)
let nativeEditor: CodeEditorInstance | null = null

onMounted(() => {
  if (nativeContainer.value) {
    nativeEditor = createEditor({
      container: nativeContainer.value,
      value: defaultCode,
      language: 'javascript',
      theme: 'vs'
    })
  }
})

onBeforeUnmount(() => {
  if (nativeEditor) {
    destroyEditor(nativeEditor)
  }
})

function onVueChange(value: string) {
  console.log('Vue editor changed:', value.length, 'chars')
}

const nativeCode = `import { createEditor } from '@ldesign/code-editor-core'

const editor = createEditor({
  container: '#editor',
  value: '// Your code here',
  language: 'javascript',
  theme: 'vs'
})

// Listen to changes
editor.on('change', (value) => {
  console.log('Code changed:', value)
})`

const vueCode = `<template>
  <CodeEditor
    v-model="code"
    language="javascript"
    theme="vs"
    height="320px"
    @change="onVueChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { CodeEditor } from '@ldesign/code-editor-vue'

const code = ref('// Your code here')

function onVueChange(value) {
  console.log('Code changed:', value)
}
<\/script>`
</script>
