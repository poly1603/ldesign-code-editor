<template>
  <div class="file-tree-node">
    <div
      class="node-label"
      :class="{ active: isActive, directory: node.type === 'directory' }"
      :style="{ paddingLeft: `${level * 16 + 8}px` }"
      @click="handleClick"
      @contextmenu.prevent="showContextMenu"
    >
      <span class="node-icon">{{ nodeIcon }}</span>
      <span v-if="!isRenaming" class="node-name">{{ node.name }}</span>
      <input
        v-else
        v-model="newName"
        class="node-input"
        @blur="finishRename"
        @keyup.enter="finishRename"
        @keyup.esc="cancelRename"
      />
    </div>
    <div v-if="isExpanded && node.children" class="node-children">
      <FileTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1"
        @select="$emit('select', $event)"
        @delete="$emit('delete', $event)"
        @rename="$emit('rename', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PropType } from 'vue'
import type { FileNode } from '../types/filesystem'

const props = defineProps({
  node: {
    type: Object as PropType<FileNode>,
    required: true,
  },
  level: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits<{
  select: [node: FileNode]
  delete: [node: FileNode]
  rename: [node: FileNode, newName: string]
}>()

const isExpanded = ref(false)
const isActive = ref(false)
const isRenaming = ref(false)
const newName = ref(props.node.name)

const nodeIcon = computed(() => {
  if (props.node.type === 'directory') {
    return isExpanded.value ? '📂' : '📁'
  }
  const ext = props.node.name.split('.').pop()
  const iconMap: Record<string, string> = {
    js: '📜', ts: '📘', vue: '💚', html: '🌐', css: '🎨',
    json: '📋', md: '📝', py: '🐍', go: '🔵', rs: '🦀',
  }
  return iconMap[ext || ''] || '📄'
})

const handleClick = () => {
  if (props.node.type === 'directory') {
    isExpanded.value = !isExpanded.value
  } else {
    emit('select', props.node)
  }
}

const showContextMenu = () => {
  isActive.value = true
}

const finishRename = () => {
  if (newName.value && newName.value !== props.node.name) {
    emit('rename', props.node, newName.value)
  }
  isRenaming.value = false
}

const cancelRename = () => {
  newName.value = props.node.name
  isRenaming.value = false
}
</script>

<style scoped>
.node-label {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
  user-select: none;
}

.node-label:hover {
  background: #2a2a2a;
}

.node-label.active {
  background: #37373d;
}

.node-icon {
  margin-right: 6px;
  font-size: 14px;
}

.node-name {
  font-size: 13px;
}

.node-input {
  background: #1e1e1e;
  border: 1px solid #007acc;
  color: #d4d4d4;
  padding: 2px 4px;
  font-size: 13px;
  outline: none;
}
</style>

