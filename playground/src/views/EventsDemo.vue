<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900 mb-2">Events</h1>
      <p class="text-slate-600">Listen to editor events like change, focus, blur, and save.</p>
    </div>

    <DemoContainer 
      title="Events Demo"
      :native-code="nativeCode"
      :vue-code="vueCode"
    >
      <template #native>
        <div class="space-y-4">
          <div ref="nativeContainer" class="h-64"></div>
          <div class="p-4 bg-slate-900 rounded-lg text-sm font-mono text-slate-300 h-32 overflow-y-auto">
            <div v-for="(log, index) in nativeLogs" :key="index" class="py-0.5">
              <span class="text-slate-500">[{{ log.time }}]</span>
              <span :class="getLogColor(log.type)" class="ml-2">{{ log.type }}:</span>
              <span class="ml-2">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </template>
      
      <template #vue>
        <div class="space-y-4">
          <CodeEditor
            v-model="code"
            language="javascript"
            theme="vs-dark"
            height="256px"
            @change="onVueChange"
            @focus="onVueFocus"
            @blur="onVueBlur"
            @save="onVueSave"
          />
          <div class="p-4 bg-slate-900 rounded-lg text-sm font-mono text-slate-300 h-32 overflow-y-auto">
            <div v-for="(log, index) in vueLogs" :key="index" class="py-0.5">
              <span class="text-slate-500">[{{ log.time }}]</span>
              <span :class="getLogColor(log.type)" class="ml-2">{{ log.type }}:</span>
              <span class="ml-2">{{ log.message }}</span>
            </div>
          </div>
          <p class="text-sm text-slate-500">Tip: Press Ctrl+S (Cmd+S) to trigger the save event</p>
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

interface LogEntry {
  time: string
  type: string
  message: string
}

const code = ref(`// Try editing this code
// Focus, blur, and press Ctrl+S to see events
function hello() {
  console.log('Hello World!')
}`)

const nativeLogs = ref<LogEntry[]>([])
const vueLogs = ref<LogEntry[]>([])

const nativeContainer = ref<HTMLElement | null>(null)
let nativeEditor: CodeEditorInstance | null = null

function getTime(): string {
  return new Date().toLocaleTimeString()
}

function addNativeLog(type: string, message: string) {
  nativeLogs.value.unshift({ time: getTime(), type, message })
  if (nativeLogs.value.length > 20) nativeLogs.value.pop()
}

function addVueLog(type: string, message: string) {
  vueLogs.value.unshift({ time: getTime(), type, message })
  if (vueLogs.value.length > 20) vueLogs.value.pop()
}

function getLogColor(type: string): string {
  const colors: Record<string, string> = {
    change: 'text-blue-400',
    focus: 'text-green-400',
    blur: 'text-yellow-400',
    save: 'text-purple-400'
  }
  return colors[type] || 'text-slate-400'
}

onMounted(() => {
  if (nativeContainer.value) {
    nativeEditor = createEditor({
      container: nativeContainer.value,
      value: code.value,
      language: 'javascript',
      theme: 'vs-dark'
    })

    nativeEditor.on('change', (value) => {
      addNativeLog('change', `Content changed (${value.length} chars)`)
    })

    nativeEditor.on('focus', () => {
      addNativeLog('focus', 'Editor focused')
    })

    nativeEditor.on('blur', () => {
      addNativeLog('blur', 'Editor blurred')
    })

    nativeEditor.on('save', (value) => {
      addNativeLog('save', `Save triggered (${value.length} chars)`)
    })
  }
})

onBeforeUnmount(() => {
  if (nativeEditor) {
    destroyEditor(nativeEditor)
  }
})

function onVueChange(value: string) {
  addVueLog('change', `Content changed (${value.length} chars)`)
}

function onVueFocus() {
  addVueLog('focus', 'Editor focused')
}

function onVueBlur() {
  addVueLog('blur', 'Editor blurred')
}

function onVueSave(value: string) {
  addVueLog('save', `Save triggered (${value.length} chars)`)
}

const nativeCode = `import { createEditor } from '@ldesign/code-editor-core'

const editor = createEditor({
  container: '#editor',
  value: code,
  language: 'javascript'
})

editor.on('change', (value) => {
  console.log('Content changed:', value.length, 'chars')
})

editor.on('focus', () => {
  console.log('Editor focused')
})

editor.on('blur', () => {
  console.log('Editor blurred')
})

editor.on('save', (value) => {
  console.log('Save triggered:', value)
})`

const vueCode = `<template>
  <CodeEditor
    v-model="code"
    language="javascript"
    @change="onVueChange"
    @focus="onVueFocus"
    @blur="onVueBlur"
    @save="onVueSave"
  />
</template>

<script setup>
import { ref } from 'vue'
import { CodeEditor } from '@ldesign/code-editor-vue'

const code = ref('// Your code')

function onVueChange(value) {
  console.log('Changed:', value.length)
}

function onVueFocus() {
  console.log('Focused')
}

function onVueBlur() {
  console.log('Blurred')
}

function onVueSave(value) {
  console.log('Saved:', value)
}
<\/script>`
</script>
