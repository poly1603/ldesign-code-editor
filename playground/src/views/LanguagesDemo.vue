<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900 mb-2">Languages</h1>
      <p class="text-slate-600">Syntax highlighting for multiple programming languages.</p>
    </div>

    <!-- Language Selector -->
    <div class="mb-6 flex items-center gap-4 flex-wrap">
      <span class="text-sm font-medium text-slate-700">Select Language:</span>
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="lang in languages"
          :key="lang.value"
          @click="currentLanguage = lang.value"
          class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          :class="[
            currentLanguage === lang.value
              ? 'bg-primary-500 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          ]"
        >
          {{ lang.label }}
        </button>
      </div>
    </div>

    <DemoContainer 
      title="Language Demo"
      :native-code="nativeCode"
      :vue-code="vueCode"
    >
      <template #native>
        <div ref="nativeContainer" class="h-80"></div>
      </template>
      
      <template #vue>
        <CodeEditor
          v-model="currentCode"
          :language="currentLanguage"
          theme="vs-dark"
          height="320px"
        />
      </template>
    </DemoContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { createEditor, destroyEditor, type CodeEditorInstance } from '@ldesign/code-editor-core'
import { CodeEditor } from '@ldesign/code-editor-vue'
import DemoContainer from '@/components/DemoContainer.vue'
import { codeExamples } from '@/data/codeExamples'

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'sql', label: 'SQL' },
  // Extended languages
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'graphql', label: 'GraphQL' },
  { value: 'prisma', label: 'Prisma' },
  { value: 'toml', label: 'TOML' },
  { value: 'dotenv', label: '.env' }
]

const currentLanguage = ref('javascript')
const currentCode = computed({
  get: () => codeExamples[currentLanguage.value],
  set: () => {}
})

const nativeContainer = ref<HTMLElement | null>(null)
let nativeEditor: CodeEditorInstance | null = null

onMounted(() => {
  if (nativeContainer.value) {
    nativeEditor = createEditor({
      container: nativeContainer.value,
      value: currentCode.value,
      language: currentLanguage.value,
      theme: 'vs-dark'
    })
  }
})

watch(currentLanguage, (newLang) => {
  if (nativeEditor) {
    nativeEditor.setValue(codeExamples[newLang])
    nativeEditor.setLanguage(newLang)
  }
})

onBeforeUnmount(() => {
  if (nativeEditor) {
    destroyEditor(nativeEditor)
  }
})

const nativeCode = `import { createEditor } from '@ldesign/code-editor-core'

const editor = createEditor({
  container: '#editor',
  value: code,
  language: 'javascript' // or 'vue', 'svelte', 'graphql', etc.
})

// Change language dynamically
editor.setLanguage('vue')`

const vueCode = `<template>
  <CodeEditor
    v-model="code"
    :language="currentLanguage"
    theme="vs-dark"
  />
  
  <select v-model="currentLanguage">
    <option value="javascript">JavaScript</option>
    <option value="vue">Vue</option>
    <option value="svelte">Svelte</option>
    <option value="graphql">GraphQL</option>
  </select>
</template>

<script setup>
import { ref } from 'vue'
import { CodeEditor } from '@ldesign/code-editor-vue'

const code = ref('// Your code')
const currentLanguage = ref('javascript')
<\/script>`
</script>
