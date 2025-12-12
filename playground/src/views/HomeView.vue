<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900 mb-2">Code Editor Playground</h1>
      <p class="text-slate-600">
        A powerful code editor component based on Monaco Editor. Supports both native JavaScript and Vue 3.
      </p>
    </div>

    <!-- Features Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div 
        v-for="feature in features" 
        :key="feature.title"
        class="p-6 bg-white rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all"
      >
        <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
          <component :is="feature.icon" class="w-5 h-5 text-primary-500" />
        </div>
        <h3 class="text-lg font-semibold text-slate-800 mb-2">{{ feature.title }}</h3>
        <p class="text-sm text-slate-600">{{ feature.description }}</p>
      </div>
    </div>

    <!-- Quick Start -->
    <div class="bg-white rounded-xl border border-slate-200 p-6">
      <h2 class="text-xl font-semibold text-slate-800 mb-4">Quick Start</h2>
      
      <div class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-slate-700 mb-2">Install</h3>
          <pre class="code-block">npm install @ldesign/code-editor-core @ldesign/code-editor-vue monaco-editor</pre>
        </div>

        <div>
          <h3 class="text-sm font-medium text-slate-700 mb-2">Usage with Vue</h3>
          <pre class="code-block"><code>&lt;template&gt;
  &lt;CodeEditor v-model="code" language="typescript" theme="vs-dark" /&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref } from 'vue'
import { CodeEditor } from '@ldesign/code-editor-vue'

const code = ref('console.log("Hello World!")')
&lt;/script&gt;</code></pre>
        </div>

        <div>
          <h3 class="text-sm font-medium text-slate-700 mb-2">Usage with Native JavaScript</h3>
          <pre class="code-block"><code>import { createEditor } from '@ldesign/code-editor-core'

const editor = createEditor({
  container: '#editor',
  value: 'console.log("Hello World!")',
  language: 'typescript',
  theme: 'vs-dark'
})</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { markRaw } from 'vue'
import { 
  Code2, 
  Palette, 
  Languages, 
  Zap, 
  GitCompare, 
  Puzzle 
} from 'lucide-vue-next'

const features = [
  {
    icon: markRaw(Code2),
    title: 'Monaco Editor',
    description: 'Built on the same editor that powers VS Code, providing a familiar editing experience.'
  },
  {
    icon: markRaw(Palette),
    title: 'Multiple Themes',
    description: 'Includes built-in themes like VS Dark, GitHub, One Dark, and Dracula.'
  },
  {
    icon: markRaw(Languages),
    title: 'Language Support',
    description: 'Syntax highlighting and IntelliSense for 30+ programming languages.'
  },
  {
    icon: markRaw(Zap),
    title: 'Events & Callbacks',
    description: 'Rich event system for change, focus, blur, save, and more.'
  },
  {
    icon: markRaw(GitCompare),
    title: 'Diff Editor',
    description: 'Compare two pieces of code side by side with the diff editor.'
  },
  {
    icon: markRaw(Puzzle),
    title: 'Vue Integration',
    description: 'Components, composables, and directives for seamless Vue 3 integration.'
  }
]
</script>
