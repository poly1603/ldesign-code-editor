/**
 * 调试管理器
 */

import { BreakpointManager } from './BreakpointManager'
import type { DebuggerConfig, VariableInfo, CallStackFrame, ConsoleMessage } from '../../types/debugger'

export class DebugManager {
  private breakpointManager: BreakpointManager
  private config: DebuggerConfig
  private isPaused = false
  private callStack: CallStackFrame[] = []
  private variables: VariableInfo[] = []
  private consoleMessages: ConsoleMessage[] = []

  constructor(config: DebuggerConfig) {
    this.config = config
    this.breakpointManager = new BreakpointManager()
  }

  getBreakpointManager(): BreakpointManager {
    return this.breakpointManager
  }

  pause(): void {
    this.isPaused = true
  }

  resume(): void {
    this.isPaused = false
  }

  stepOver(): void {
    console.log('Step over')
  }

  stepInto(): void {
    console.log('Step into')
  }

  stepOut(): void {
    console.log('Step out')
  }

  evaluateExpression(expression: string): Promise<unknown> {
    return Promise.resolve(eval(expression))
  }

  getCallStack(): CallStackFrame[] {
    return [...this.callStack]
  }

  getVariables(): VariableInfo[] {
    return [...this.variables]
  }

  addConsoleMessage(message: ConsoleMessage): void {
    this.consoleMessages.push(message)
  }

  getConsoleMessages(): ConsoleMessage[] {
    return [...this.consoleMessages]
  }

  clearConsole(): void {
    this.consoleMessages = []
  }
}

