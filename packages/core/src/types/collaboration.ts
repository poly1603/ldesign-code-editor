/**
 * 协同编辑类型定义
 */

export interface CollaborationConfig {
  enabled: boolean
  serverUrl: string
  roomId?: string
  user: UserInfo
  autoConnect?: boolean
  reconnectAttempts?: number
  reconnectDelay?: number
}

export interface UserInfo {
  id: string
  name: string
  email?: string
  avatar?: string
  color?: string
}

export interface UserPresence extends UserInfo {
  online: boolean
  lastSeen: number
  cursor?: CursorPosition
  selection?: SelectionRange
}

export interface CursorPosition {
  line: number
  column: number
}

export interface SelectionRange {
  start: CursorPosition
  end: CursorPosition
}

export interface CollaborationMessage {
  type: CollaborationMessageType
  senderId: string
  timestamp: number
  data: unknown
}

export type CollaborationMessageType =
  | 'join'
  | 'leave'
  | 'edit'
  | 'cursor'
  | 'selection'
  | 'sync'
  | 'ack'
  | 'presence'
  | 'chat'

export interface EditOperation {
  type: 'insert' | 'delete' | 'replace'
  position: CursorPosition
  content: string
  length?: number
  version: number
  userId: string
  timestamp: number
}

export interface SyncState {
  version: number
  content: string
  checksum: string
  timestamp: number
}

export interface ConflictResolution {
  conflicts: EditOperation[]
  resolution: EditOperation
  strategy: 'ours' | 'theirs' | 'merge'
}

export interface CollaborationEvents {
  onUserJoined?: (user: UserInfo) => void
  onUserLeft?: (userId: string) => void
  onEdit?: (operation: EditOperation) => void
  onCursorChange?: (userId: string, position: CursorPosition) => void
  onSelectionChange?: (userId: string, selection: SelectionRange) => void
  onSync?: (state: SyncState) => void
  onConflict?: (conflict: ConflictResolution) => void
  onError?: (error: Error) => void
}

export interface CRDTOperation {
  id: string
  type: 'insert' | 'delete'
  position: number
  content?: string
  length?: number
  timestamp: number
  userId: string
  lamportClock: number
}

export interface CRDTDocument {
  operations: CRDTOperation[]
  content: string
  version: number
}

