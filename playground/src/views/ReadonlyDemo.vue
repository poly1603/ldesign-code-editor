<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900 mb-2">Read Only Mode</h1>
      <p class="text-slate-600">Display code in read-only mode, perfect for code snippets and documentation.</p>
    </div>

    <!-- Toggle -->
    <div class="mb-6 flex items-center gap-4">
      <span class="text-sm font-medium text-slate-700">Read Only:</span>
      <button
        @click="isReadOnly = !isReadOnly"
        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
        :class="isReadOnly ? 'bg-primary-500' : 'bg-slate-300'"
      >
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
          :class="isReadOnly ? 'translate-x-6' : 'translate-x-1'"
        />
      </button>
      <span class="text-sm text-slate-500">{{ isReadOnly ? 'Enabled' : 'Disabled' }}</span>
    </div>

    <DemoContainer 
      title="Read Only Demo"
      :native-code="nativeCode"
      :vue-code="vueCode"
    >
      <template #native>
        <div ref="nativeContainer" class="h-80"></div>
      </template>
      
      <template #vue>
        <CodeEditor
          v-model="code"
          language="typescript"
          theme="vs-dark"
          height="320px"
          :read-only="isReadOnly"
        />
      </template>
    </DemoContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { createEditor, destroyEditor, type CodeEditorInstance } from '@ldesign/code-editor-core'
import { CodeEditor } from '@ldesign/code-editor-vue'
import DemoContainer from '@/components/DemoContainer.vue'

const isReadOnly = ref(true)

const code = ref(`// This is a read-only code example
// Toggle the switch above to enable editing

interface ApiResponse<T> {
  data: T
  status: number
  message: string
  timestamp: Date
}

async function fetchUsers(): Promise<ApiResponse<User[]>> {
  const response = await fetch('/api/users')
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`)
  }
  
  return response.json()
}

// Usage
const { data: users } = await fetchUsers()
console.log(\`Found \${users.length} users\`)`)

const nativeContainer = ref<HTMLElement | null>(null)
let nativeEditor: CodeEditorInstance | null = null

onMounted(() => {
  if (nativeContainer.value) {
    nativeEditor = createEditor({
      container: nativeContainer.value,
      value: code.value,
      language: 'typescript',
      theme: 'vs-dark',
      readOnly: isReadOnly.value
    })
  }
})

watch(isReadOnly, (newValue) => {
  nativeEditor?.updateOptions({ readOnly: newValue })
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
  language: 'typescript',
  readOnly: true // Enable read-only mode
})

// Toggle read-only dynamically
editor.updateOptions({ readOnly: false })`

const vueCode = `<template>
  <CodeEditor
    v-model="code"
    language="typescript"
    :read-only="isReadOnly"
  />
  
  <button @click="isReadOnly = !isReadOnly">
    Toggle Read Only
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { CodeEditor } from '@ldesign/code-editor-vue'

const code = ref('// Your code')
const isReadOnly = ref(true)
<\/script>`
</script>
