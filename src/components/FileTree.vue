<template>
  <div class="file-tree">
    <div class="file-tree-header">
      <h3>{{ title }}</h3>
      <div class="file-tree-actions">
        <button @click="createFile" title="新建文件">+📄</button>
        <button @click="createFolder" title="新建文件夹">+📁</button>
      </div>
    </div>
    <div class="file-tree-content">
      <FileTreeNode
        v-for="node in rootNodes"
        :key="node.id"
        :node="node"
        :level="0"
        @select="handleSelect"
        @delete="handleDelete"
        @rename="handleRename"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PropType } from 'vue'
import type { FileNode } from '../types/filesystem'
import FileTreeNode from './FileTreeNode.vue'

const props = defineProps({
  root: {
    type: Object as PropType<FileNode>,
    required: true,
  },
  title: {
    type: String,
    default: '文件浏览器',
  },
})

const emit = defineEmits<{
  select: [node: FileNode]
  create: [type: 'file' | 'directory', parent: FileNode]
  delete: [node: FileNode]
  rename: [node: FileNode, newName: string]
}>()

const rootNodes = computed(() => props.root.children || [])

const createFile = () => {
  emit('create', 'file', props.root)
}

const createFolder = () => {
  emit('create', 'directory', props.root)
}

const handleSelect = (node: FileNode) => {
  emit('select', node)
}

const handleDelete = (node: FileNode) => {
  emit('delete', node)
}

const handleRename = (node: FileNode, newName: string) => {
  emit('rename', node, newName)
}
</script>

<style scoped>
.file-tree {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  color: #d4d4d4;
}

.file-tree-header {
  padding: 8px 12px;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-tree-header h3 {
  margin: 0;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 600;
}

.file-tree-actions button {
  background: none;
  border: none;
  color: #d4d4d4;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 14px;
}

.file-tree-actions button:hover {
  background: #2a2a2a;
  border-radius: 4px;
}

.file-tree-content {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}
</style>

