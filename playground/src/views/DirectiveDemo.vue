<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900 mb-2">Directive</h1>
      <p class="text-slate-600">Use the v-code-editor directive for quick setup.</p>
    </div>

    <DemoContainer 
      title="v-code-editor Directive"
      :native-code="nativeCode"
      :vue-code="vueCode"
    >
      <template #native>
        <div ref="nativeContainer" class="h-80"></div>
      </template>
      
      <template #vue>
        <div class="space-y-4">
          <div
            v-code-editor="directiveOptions"
            class="h-80 border border-slate-200 rounded-lg overflow-hidden"
          ></div>
          <div class="flex gap-2">
            <button @click="changeLanguage('javascript')" class="btn">JavaScript</button>
            <button @click="changeLanguage('typescript')" class="btn">TypeScript</button>
            <button @click="changeLanguage('python')" class="btn">Python</button>
          </div>
        </div>
      </template>
    </DemoContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { createEditor, destroyEditor, type CodeEditorInstance } from '@ldesign/code-editor-core'
import { vCodeEditor } from '@ldesign/code-editor-vue'
import DemoContainer from '@/components/DemoContainer.vue'

const codeExamples: Record<string, string> = {
  javascript: `// JavaScript code
const greet = (name) => {
  return \`Hello, \${name}!\`
}

console.log(greet('World'))`,
  typescript: `// TypeScript code
const greet = (name: string): string => {
  return \`Hello, \${name}!\`
}

console.log(greet('World'))`,
  python: `# Python code
def greet(name: str) -> str:
    return f"Hello, {name}!"

print(greet("World"))`
}

// Native JS
const nativeContainer = ref<HTMLElement | null>(null)
let nativeEditor: CodeEditorInstance | null = null

onMounted(() => {
  if (nativeContainer.value) {
    nativeEditor = createEditor({
      container: nativeContainer.value,
      value: codeExamples.javascript,
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

// Vue directive
const directiveOptions = reactive({
  value: codeExamples.javascript,
  language: 'javascript',
  theme: 'vs-dark',
  onReady: (editor: CodeEditorInstance) => {
    console.log('Directive editor ready:', editor)
  }
})

function changeLanguage(lang: string) {
  directiveOptions.language = lang
  directiveOptions.value = codeExamples[lang]
}

const nativeCode = `import { createEditor } from '@ldesign/code-editor-core'

// Using createEditor directly
const editor = createEditor({
  container: '#editor',
  value: code,
  language: 'javascript',
  theme: 'vs-dark'
})`

const vueCode = `<template>
  <!-- Basic usage -->
  <div v-code-editor="options"></div>
  
  <!-- With readonly modifier -->
  <div v-code-editor.readonly="options"></div>
</template>

<script setup>
import { reactive } from 'vue'
import { vCodeEditor } from '@ldesign/code-editor-vue'

const options = reactive({
  value: '// Your code',
  language: 'javascript',
  theme: 'vs-dark',
  onReady: (editor) => {
    console.log('Editor ready:', editor)
  },
  onChange: (value) => {
    console.log('Value changed:', value)
  },
  onSave: (value) => {
    console.log('Save triggered:', value)
  }
})

// Update options reactively
options.language = 'typescript'
options.value = '// New code'
<\/script>`
</script>

<style scoped>
.btn {
  @apply px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors;
}
</style>
