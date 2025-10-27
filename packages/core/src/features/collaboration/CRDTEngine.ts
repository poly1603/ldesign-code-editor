/**
 * CRDT (Conflict-free Replicated Data Type) 引擎
 * 实现无冲突的协同编辑
 */

import type { CRDTOperation, CRDTDocument, EditOperation } from '../../types/collaboration'

/**
 * CRDT 引擎类
 * 基于 WOOT (WithOut Operational Transformation) 算法
 */
export class CRDTEngine {
  private document: CRDTDocument
  private userId: string
  private lamportClock = 0

  constructor(userId: string, initialContent = '') {
    this.userId = userId
    this.document = {
      operations: [],
      content: initialContent,
      version: 0,
    }
  }

  /**
   * 本地插入操作
   */
  insert(position: number, content: string): CRDTOperation {
    this.lamportClock++

    const operation: CRDTOperation = {
      id: this.generateId(),
      type: 'insert',
      position,
      content,
      timestamp: Date.now(),
      userId: this.userId,
      lamportClock: this.lamportClock,
    }

    this.applyOperation(operation)
    return operation
  }

  /**
   * 本地删除操作
   */
  delete(position: number, length: number): CRDTOperation {
    this.lamportClock++

    const operation: CRDTOperation = {
      id: this.generateId(),
      type: 'delete',
      position,
      length,
      timestamp: Date.now(),
      userId: this.userId,
      lamportClock: this.lamportClock,
    }

    this.applyOperation(operation)
    return operation
  }

  /**
   * 应用远程操作
   */
  applyRemoteOperation(operation: CRDTOperation): void {
    // 更新 Lamport 时钟
    this.lamportClock = Math.max(this.lamportClock, operation.lamportClock) + 1

    // 转换操作以处理并发
    const transformedOperation = this.transformOperation(operation)

    // 应用操作
    this.applyOperation(transformedOperation)
  }

  /**
   * 应用操作
   */
  private applyOperation(operation: CRDTOperation): void {
    this.document.operations.push(operation)

    if (operation.type === 'insert' && operation.content) {
      const before = this.document.content.substring(0, operation.position)
      const after = this.document.content.substring(operation.position)
      this.document.content = before + operation.content + after
    } else if (operation.type === 'delete' && operation.length) {
      const before = this.document.content.substring(0, operation.position)
      const after = this.document.content.substring(operation.position + operation.length)
      this.document.content = before + after
    }

    this.document.version++
  }

  /**
   * 操作转换（处理并发操作）
   */
  private transformOperation(operation: CRDTOperation): CRDTOperation {
    let transformedPosition = operation.position

    // 根据之前的操作调整位置
    for (const op of this.document.operations) {
      if (op.lamportClock < operation.lamportClock) {
        if (op.type === 'insert' && op.position <= transformedPosition) {
          transformedPosition += op.content?.length || 0
        } else if (op.type === 'delete' && op.position < transformedPosition) {
          transformedPosition -= Math.min(op.length || 0, transformedPosition - op.position)
        }
      }
    }

    return {
      ...operation,
      position: transformedPosition,
    }
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `${this.userId}-${this.lamportClock}-${Date.now()}`
  }

  /**
   * 获取文档内容
   */
  getContent(): string {
    return this.document.content
  }

  /**
   * 获取文档版本
   */
  getVersion(): number {
    return this.document.version
  }

  /**
   * 获取所有操作
   */
  getOperations(): CRDTOperation[] {
    return [...this.document.operations]
  }

  /**
   * 重置文档
   */
  reset(content = ''): void {
    this.document = {
      operations: [],
      content,
      version: 0,
    }
    this.lamportClock = 0
  }

  /**
   * 同步文档状态
   */
  sync(remoteDocument: CRDTDocument): void {
    // 找出需要应用的操作
    const localOps = new Set(this.document.operations.map((op) => op.id))
    const missingOps = remoteDocument.operations.filter((op) => !localOps.has(op.id))

    // 按 Lamport 时钟排序
    missingOps.sort((a, b) => a.lamportClock - b.lamportClock)

    // 应用缺失的操作
    for (const op of missingOps) {
      this.applyRemoteOperation(op)
    }
  }

  /**
   * 创建快照
   */
  createSnapshot(): CRDTDocument {
    return {
      operations: [...this.document.operations],
      content: this.document.content,
      version: this.document.version,
    }
  }

  /**
   * 从快照恢复
   */
  restoreFromSnapshot(snapshot: CRDTDocument): void {
    this.document = {
      operations: [...snapshot.operations],
      content: snapshot.content,
      version: snapshot.version,
    }

    // 更新 Lamport 时钟
    if (snapshot.operations.length > 0) {
      this.lamportClock = Math.max(...snapshot.operations.map((op) => op.lamportClock))
    }
  }

  /**
   * 转换为编辑器操作
   */
  toEditorOperation(operation: CRDTOperation): EditOperation {
    return {
      type: operation.type === 'insert' ? 'insert' : 'delete',
      position: {
        line: this.offsetToPosition(operation.position).line,
        column: this.offsetToPosition(operation.position).column,
      },
      content: operation.content || '',
      length: operation.length,
      version: this.document.version,
      userId: operation.userId,
      timestamp: operation.timestamp,
    }
  }

  /**
   * 从编辑器操作转换
   */
  fromEditorOperation(operation: EditOperation): CRDTOperation {
    this.lamportClock++

    return {
      id: this.generateId(),
      type: operation.type === 'insert' ? 'insert' : 'delete',
      position: this.positionToOffset(operation.position),
      content: operation.content,
      length: operation.length,
      timestamp: operation.timestamp,
      userId: operation.userId,
      lamportClock: this.lamportClock,
    }
  }

  /**
   * 位置转偏移量
   */
  private positionToOffset(position: { line: number; column: number }): number {
    const lines = this.document.content.split('\n')
    let offset = 0

    for (let i = 0; i < position.line && i < lines.length; i++) {
      offset += lines[i].length + 1 // +1 for newline
    }

    offset += position.column
    return offset
  }

  /**
   * 偏移量转位置
   */
  private offsetToPosition(offset: number): { line: number; column: number } {
    const lines = this.document.content.split('\n')
    let currentOffset = 0

    for (let line = 0; line < lines.length; line++) {
      const lineLength = lines[line].length + 1 // +1 for newline

      if (currentOffset + lineLength > offset) {
        return {
          line,
          column: offset - currentOffset,
        }
      }

      currentOffset += lineLength
    }

    return {
      line: lines.length - 1,
      column: lines[lines.length - 1]?.length || 0,
    }
  }
}

