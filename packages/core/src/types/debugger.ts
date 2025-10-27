/**
 * 调试器类型定义
 */

export interface Breakpoint {
  id: string
  line: number
  column?: number
  enabled: boolean
  condition?: string
  hitCount?: number
}

export interface DebuggerConfig {
  enabled: boolean
  pauseOnException?: boolean
  pauseOnCaughtException?: boolean
  showConsole?: boolean
}

export interface VariableInfo {
  name: string
  value: unknown
  type: string
  scope: 'local' | 'global' | 'closure'
  children?: VariableInfo[]
}

export interface CallStackFrame {
  id: number
  name: string
  file: string
  line: number
  column: number
}

export interface ConsoleMessage {
  id: string
  type: 'log' | 'warn' | 'error' | 'info' | 'debug'
  message: string
  timestamp: number
  stack?: string
}

