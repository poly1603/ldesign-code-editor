<template>
  <div class="demo-container">
    <!-- Header with title and tabs -->
    <div class="demo-header">
      <h3 class="text-sm font-semibold text-slate-700">{{ title }}</h3>
      <div class="flex items-center gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="tab-button"
          :class="{ active: activeTab === tab.key }"
        >
          <component :is="tab.icon" class="w-4 h-4 mr-1.5 inline" />
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="demo-content">
      <!-- Native JS Demo -->
      <div v-show="activeTab === 'native'">
        <slot name="native"></slot>
      </div>

      <!-- Vue Demo -->
      <div v-show="activeTab === 'vue'">
        <slot name="vue"></slot>
      </div>

      <!-- Code View -->
      <div v-show="activeTab === 'code'" class="space-y-4">
        <div v-if="nativeCode">
          <div class="text-xs font-medium text-slate-500 mb-2">Native JavaScript</div>
          <pre class="code-block"><code v-html="highlightCode(nativeCode, 'javascript')"></code></pre>
        </div>
        <div v-if="vueCode">
          <div class="text-xs font-medium text-slate-500 mb-2">Vue Component</div>
          <pre class="code-block"><code v-html="highlightCode(vueCode, 'vue')"></code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import { FileCode, Box, Eye } from 'lucide-vue-next'

defineProps<{
  title: string
  nativeCode?: string
  vueCode?: string
}>()

const activeTab = ref<'native' | 'vue' | 'code'>('native')

const tabs = [
  { key: 'native' as const, label: 'Native JS', icon: markRaw(FileCode) },
  { key: 'vue' as const, label: 'Vue', icon: markRaw(Box) },
  { key: 'code' as const, label: 'Code', icon: markRaw(Eye) }
]

function highlightCode(code: string, _lang: string): string {
  // Simple syntax highlighting
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>')
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>')
    .replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="string">$1$2$1</span>')
    .replace(/\b(const|let|var|function|return|if|else|for|while|import|export|from|default|async|await|new|class|extends|this|true|false|null|undefined)\b/g, '<span class="keyword">$1</span>')
    .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span class="function">$1</span>')
}
</script>
