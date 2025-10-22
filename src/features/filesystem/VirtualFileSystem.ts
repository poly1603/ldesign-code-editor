/**
 * 虚拟文件系统
 */

import type { FileNode, FileSystemConfig, FileOperation } from '../../types/filesystem'

export class VirtualFileSystem {
  private root: FileNode
  private files = new Map<string, FileNode>()
  private config: FileSystemConfig

  constructor(config: FileSystemConfig = {}) {
    this.config = {
      rootPath: config.rootPath || '/',
      maxFileSize: config.maxFileSize || 10 * 1024 * 1024, // 10MB
      virtualMode: config.virtualMode !== false,
    }

    this.root = {
      id: 'root',
      name: '/',
      type: 'directory',
      path: '/',
      children: [],
    }

    this.files.set('/', this.root)
  }

  async createFile(path: string, content = ''): Promise<FileNode> {
    const name = path.split('/').pop() || ''
    const file: FileNode = {
      id: this.generateId(),
      name,
      type: 'file',
      path,
      content,
      size: content.length,
      created: Date.now(),
      modified: Date.now(),
    }

    this.files.set(path, file)
    this.addToParent(path, file)
    return file
  }

  async createDirectory(path: string): Promise<FileNode> {
    const name = path.split('/').pop() || ''
    const dir: FileNode = {
      id: this.generateId(),
      name,
      type: 'directory',
      path,
      children: [],
      created: Date.now(),
    }

    this.files.set(path, dir)
    this.addToParent(path, dir)
    return dir
  }

  async readFile(path: string): Promise<string> {
    const file = this.files.get(path)
    if (!file || file.type !== 'file') {
      throw new Error(`File not found: ${path}`)
    }
    return file.content || ''
  }

  async writeFile(path: string, content: string): Promise<void> {
    let file = this.files.get(path)
    if (!file) {
      file = await this.createFile(path, content)
    } else {
      file.content = content
      file.size = content.length
      file.modified = Date.now()
    }
  }

  async deleteFile(path: string): Promise<void> {
    this.files.delete(path)
    this.removeFromParent(path)
  }

  async renameFile(oldPath: string, newPath: string): Promise<void> {
    const file = this.files.get(oldPath)
    if (!file) throw new Error(`File not found: ${oldPath}`)

    file.path = newPath
    file.name = newPath.split('/').pop() || ''
    this.files.delete(oldPath)
    this.files.set(newPath, file)
  }

  getFile(path: string): FileNode | undefined {
    return this.files.get(path)
  }

  listDirectory(path: string): FileNode[] {
    const dir = this.files.get(path)
    if (!dir || dir.type !== 'directory') return []
    return dir.children || []
  }

  getRoot(): FileNode {
    return this.root
  }

  private addToParent(path: string, node: FileNode): void {
    const parentPath = this.getParentPath(path)
    const parent = this.files.get(parentPath)
    if (parent && parent.type === 'directory') {
      if (!parent.children) parent.children = []
      parent.children.push(node)
    }
  }

  private removeFromParent(path: string): void {
    const parentPath = this.getParentPath(path)
    const parent = this.files.get(parentPath)
    if (parent && parent.children) {
      parent.children = parent.children.filter((c) => c.path !== path)
    }
  }

  private getParentPath(path: string): string {
    const parts = path.split('/').filter(Boolean)
    parts.pop()
    return '/' + parts.join('/')
  }

  private generateId(): string {
    return `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

