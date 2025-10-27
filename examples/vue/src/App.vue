<template>
  <div class="app">
    <header>
      <h1>🚀 Code Editor - Vue 3 Example</h1>
    </header>

    <div class="controls">
      <select v-model="language" class="control-select">
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
        <option value="go">Go</option>
        <option value="rust">Rust</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
        <option value="json">JSON</option>
        <option value="markdown">Markdown</option>
      </select>

      <select v-model="theme" class="control-select">
        <option value="vs-dark">VS Dark</option>
        <option value="vs">VS Light</option>
        <option value="hc-black">High Contrast</option>
      </select>

      <input v-model.number="fontSize" type="number" min="10" max="30" class="control-input" placeholder="Font Size">

      <button @click="handleFormat" class="control-btn">格式化代码</button>
      <button @click="handleGetValue" class="control-btn">获取内容</button>
      <button @click="handleClear" class="control-btn">清空</button>
      <button @click="handleUndo" class="control-btn">撤销</button>
      <button @click="handleRedo" class="control-btn">重做</button>
      <button @click="toggleReadOnly" class="control-btn">{{ readOnly ? '取消只读' : '切换只读' }}</button>
    </div>

    <div class="editor-wrapper">
      <CodeEditor
        ref="editorRef"
        v-model="code"
        :language="language"
        :theme="theme"
        :font-size="fontSize"
        :read-only="readOnly"
        :minimap="true"
        :folding="true"
        :line-numbers="'on'"
        :auto-complete="true"
        @ready="onEditorReady"
        @change="onCodeChange"
        @cursor-change="onCursorChange"
        @focus="onFocus"
        @blur="onBlur"
      />
    </div>

    <div class="stats">
      <div><strong>状态:</strong> {{ status }}</div>
      <div><strong>行数:</strong> {{ lineCount }}</div>
      <div><strong>光标位置:</strong> {{ cursorPos }}</div>
      <div><strong>选中文本:</strong> {{ selectedText }}</div>
      <div><strong>代码长度:</strong> {{ code.length }} 字符</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CodeEditor } from '@ldesign/code-editor-vue'
import type { CodeEditor as CoreCodeEditor } from '@ldesign/code-editor-core'
import type * as Monaco from 'monaco-editor'

const initialCode = `// 欢迎使用 LDesign Code Editor Vue 3 组件!
// 这是一个功能强大的代码编辑器

<template>
  <div class="hello-world">
    <h1>{{ message }}</h1>
    <button @click="count++">点击次数: {{ count }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Hello Vue 3!')
const count = ref(0)
<\/script>

// 支持的特性:
// ✓ 双向绑定 (v-model)
// ✓ 响应式更新
// ✓ 语法高亮
// ✓ 自动补全
// ✓ 代码格式化
// ✓ 多语言支持
// ✓ 主题切换
`

const editorRef = ref<InstanceType<typeof CodeEditor>>()
const code = ref(initialCode)
const language = ref('javascript')
const theme = ref('vs-dark')
const fontSize = ref(14)
const readOnly = ref(false)
const status = ref('初始化中...')
const lineCount = ref(0)
const cursorPos = ref('1:1')
const selectedText = ref('无')

const onEditorReady = (editor: CoreCodeEditor) => {
  status.value = '就绪'
  updateStats()
  console.log('Editor ready!', editor)
}

const onCodeChange = (value: string) => {
  updateStats()
  console.log('Code changed:', value.length, 'characters')
}

const onCursorChange = (position: Monaco.Position) => {
  cursorPos.value = `${position.lineNumber}:${position.column}`
}

const onFocus = () => {
  status.value = '已聚焦'
}

const onBlur = () => {
  status.value = '失去焦点'
}

const updateStats = () => {
  if (!editorRef.value) return

  const editor = editorRef.value.editor
  if (!editor) return

  const state = editor.getState()
  lineCount.value = state.lineCount

  const selection = editor.getSelection()
  selectedText.value = selection ? `已选中 ${selection.length} 个字符` : '无'
}

const handleFormat = async () => {
  await editorRef.value?.format()
  status.value = '代码已格式化'
}

const handleGetValue = () => {
  const value = editorRef.value?.getValue()
  console.log('Editor content:', value)
  alert(`内容长度: ${value?.length} 个字符\n(详细内容请查看控制台)`)
}

const handleClear = () => {
  if (confirm('确定要清空编辑器内容吗?')) {
    code.value = ''
    status.value = '已清空'
  }
}

const handleUndo = () => {
  editorRef.value?.undo()
  status.value = '已撤销'
}

const handleRedo = () => {
  editorRef.value?.redo()
  status.value = '已重做'
}

const toggleReadOnly = () => {
  readOnly.value = !readOnly.value
  status.value = readOnly.value ? '只读模式' : '编辑模式'
}
</script>

<style scoped>
.app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

header {
  margin-bottom: 20px;
}

h1 {
  color: #667eea;
  font-size: 32px;
  margin: 0;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.control-select,
.control-input {
  padding: 10px;
  background: #2d2d30;
  color: white;
  border: 1px solid #3e3e42;
  border-radius: 4px;
  font-size: 14px;
}

.control-input {
  width: 80px;
}

.control-btn {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.control-btn:hover {
  background: #5568d3;
}

.control-btn:active {
  background: #4451b8;
}

.editor-wrapper {
  width: 100%;
  height: 600px;
  border: 1px solid #3e3e42;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.stats {
  margin-top: 20px;
  padding: 15px;
  background: #2d2d30;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.stats div {
  margin-bottom: 5px;
}

.stats strong {
  color: #667eea;
}
</style>

