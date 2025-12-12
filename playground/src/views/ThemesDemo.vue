<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900 mb-2">Themes</h1>
      <p class="text-slate-600">Switch between different editor themes.</p>
    </div>

    <!-- Theme Selector -->
    <div class="mb-6 flex items-center gap-4">
      <span class="text-sm font-medium text-slate-700">Select Theme:</span>
      <div class="flex gap-2">
        <button
          v-for="theme in themes"
          :key="theme.value"
          @click="currentTheme = theme.value"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="[
            currentTheme === theme.value
              ? 'bg-primary-500 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          ]"
        >
          {{ theme.label }}
        </button>
      </div>
    </div>

    <DemoContainer 
      title="Theme Demo"
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
          :theme="currentTheme"
          height="320px"
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

const themes = [
  { value: 'vs', label: 'Light' },
  { value: 'vs-dark', label: 'Dark' },
  { value: 'github-light', label: 'GitHub Light' },
  { value: 'github-dark', label: 'GitHub Dark' },
  { value: 'one-dark', label: 'One Dark' },
  { value: 'dracula', label: 'Dracula' }
]

const currentTheme = ref('vs-dark')

const code = ref(`interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

function getUserInfo(user: User): string {
  return \`\${user.name} (\${user.email})\`
}

const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin'
}

console.log(getUserInfo(user))`)

const nativeContainer = ref<HTMLElement | null>(null)
let nativeEditor: CodeEditorInstance | null = null

onMounted(() => {
  if (nativeContainer.value) {
    nativeEditor = createEditor({
      container: nativeContainer.value,
      value: code.value,
      language: 'typescript',
      theme: currentTheme.value
    })
  }
})

watch(currentTheme, (newTheme) => {
  nativeEditor?.setTheme(newTheme)
})

onBeforeUnmount(() => {
  if (nativeEditor) {
    destroyEditor(nativeEditor)
  }
})

const nativeCode = `import { createEditor, registerTheme } from '@ldesign/code-editor-core'

const editor = createEditor({
  container: '#editor',
  value: code,
  language: 'typescript',
  theme: 'vs-dark' // 'vs', 'vs-dark', 'github-light', etc.
})

// Change theme dynamically
editor.setTheme('dracula')

// Register custom theme
registerTheme({
  name: 'my-theme',
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6a9955' }
  ],
  colors: {
    'editor.background': '#1a1a2e'
  }
})`

const vueCode = `<template>
  <CodeEditor
    v-model="code"
    language="typescript"
    :theme="currentTheme"
    height="320px"
  />
  
  <select v-model="currentTheme">
    <option value="vs">Light</option>
    <option value="vs-dark">Dark</option>
    <option value="github-dark">GitHub Dark</option>
  </select>
</template>

<script setup>
import { ref } from 'vue'
import { CodeEditor } from '@ldesign/code-editor-vue'

const code = ref('// Your code')
const currentTheme = ref('vs-dark')
<\/script>`
</script>
