/**
 * 文件系统类型定义
 */

export interface FileNode {
  id: string
  name: string
  type: 'file' | 'directory'
  path: string
  content?: string
  language?: string
  children?: FileNode[]
  size?: number
  modified?: number
  created?: number
  readonly?: boolean
}

export interface FileSystemConfig {
  rootPath?: string
  maxFileSize?: number
  allowedExtensions?: string[]
  virtualMode?: boolean
}

export interface FileOperation {
  type: 'create' | 'read' | 'update' | 'delete' | 'rename' | 'move'
  path: string
  newPath?: string
  content?: string
  options?: Record<string, unknown>
}

export interface FileSearchOptions {
  query: string
  extensions?: string[]
  maxResults?: number
  caseSensitive?: boolean
  regex?: boolean
  includeContent?: boolean
}

export interface FileSearchResult {
  file: FileNode
  matches: Array<{
    line: number
    column: number
    text: string
  }>
}

export interface TabInfo {
  id: string
  file: FileNode
  active: boolean
  dirty: boolean
  content: string
}

