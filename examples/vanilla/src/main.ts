import { createCodeEditor } from '@ldesign/code-editor-core'
import type { CodeEditor } from '@ldesign/code-editor-core'

// 初始代码
const initialCode = `// 欢迎使用 LDesign Code Editor!
// 这是一个功能强大的代码编辑器

function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

// 计算斐波那契数列
for (let i = 0; i < 10; i++) {
  console.log(\`fibonacci(\${i}) = \${fibonacci(i)}\`)
}

// 支持的特性:
// ✓ 语法高亮
// ✓ 自动补全
// ✓ 代码格式化
// ✓ 多语言支持
// ✓ 主题切换
// ✓ 快捷键支持
`

// 创建编辑器
let editor: CodeEditor | null = null
let isReadOnly = false

function initEditor() {
  const container = document.getElementById('editor')
  if (!container) return

  editor = createCodeEditor(container, {
    language: 'javascript',
    theme: 'vs-dark',
    value: initialCode,
    fontSize: 14,
    minimap: true,
    folding: true,
    autoComplete: true,
    on: {
      ready: () => {
        updateStatus('就绪')
        updateStats()
        console.log('Editor ready!')
      },
      change: (value) => {
        updateStats()
      },
      cursorChange: (position) => {
        updateCursorPosition(position)
      },
      focus: () => {
        updateStatus('已聚焦')
      },
      blur: () => {
        updateStatus('失去焦点')
      }
    }
  })
}

// 更新状态
function updateStatus(status: string) {
  const statusEl = document.getElementById('status')
  if (statusEl) {
    statusEl.textContent = status
  }
}

// 更新统计信息
function updateStats() {
  if (!editor) return

  const state = editor.getState()

  const lineCountEl = document.getElementById('lineCount')
  if (lineCountEl) {
    lineCountEl.textContent = state.lineCount.toString()
  }

  const selectedText = editor.getSelection()
  const selectedTextEl = document.getElementById('selectedText')
  if (selectedTextEl) {
    selectedTextEl.textContent = selectedText ? `已选中 ${selectedText.length} 个字符` : '无'
  }
}

// 更新光标位置
function updateCursorPosition(position: { lineNumber: number; column: number }) {
  const cursorPosEl = document.getElementById('cursorPos')
  if (cursorPosEl) {
    cursorPosEl.textContent = `${position.lineNumber}:${position.column}`
  }
}

// 语言选择
document.getElementById('language')?.addEventListener('change', (e) => {
  const language = (e.target as HTMLSelectElement).value
  editor?.setLanguage(language as any)
  updateStatus(`语言已切换: ${language}`)
})

// 主题选择
document.getElementById('theme')?.addEventListener('change', (e) => {
  const theme = (e.target as HTMLSelectElement).value
  editor?.setTheme(theme as any)
  updateStatus(`主题已切换: ${theme}`)
})

// 字体大小
document.getElementById('fontSize')?.addEventListener('change', (e) => {
  const fontSize = parseInt((e.target as HTMLInputElement).value)
  editor?.updateOptions({ fontSize })
  updateStatus(`字体大小: ${fontSize}`)
})

// 格式化代码
document.getElementById('formatBtn')?.addEventListener('click', async () => {
  await editor?.format()
  updateStatus('代码已格式化')
})

// 获取内容
document.getElementById('getValueBtn')?.addEventListener('click', () => {
  const value = editor?.getValue()
  console.log('Editor content:', value)
  alert(`内容长度: ${value?.length} 个字符\n(详细内容请查看控制台)`)
})

// 清空
document.getElementById('clearBtn')?.addEventListener('click', () => {
  if (confirm('确定要清空编辑器内容吗?')) {
    editor?.setValue('')
    updateStatus('已清空')
  }
})

// 撤销
document.getElementById('undoBtn')?.addEventListener('click', () => {
  editor?.undo()
  updateStatus('已撤销')
})

// 重做
document.getElementById('redoBtn')?.addEventListener('click', () => {
  editor?.redo()
  updateStatus('已重做')
})

// 切换只读
document.getElementById('toggleReadOnlyBtn')?.addEventListener('click', () => {
  isReadOnly = !isReadOnly
  editor?.setReadOnly(isReadOnly)
  updateStatus(isReadOnly ? '只读模式' : '编辑模式')
  const btn = document.getElementById('toggleReadOnlyBtn')
  if (btn) {
    btn.textContent = isReadOnly ? '取消只读' : '切换只读'
  }
})

// 初始化编辑器
initEditor()

// 清理
window.addEventListener('beforeunload', () => {
  editor?.dispose()
})

