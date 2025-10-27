/**
 * 代码上下文分析器
 * 分析编辑器中的代码上下文
 */

import type * as Monaco from 'monaco-editor'
import type { CodeContext } from '../../types/ai'

/**
 * 上下文分析器类
 */
export class ContextAnalyzer {
  /**
   * 分析代码上下文
   */
  analyzeContext(model: Monaco.editor.ITextModel, position: Monaco.Position): CodeContext {
    const fullText = model.getValue()
    const offset = model.getOffsetAt(position)

    const beforeCursor = fullText.substring(0, offset)
    const afterCursor = fullText.substring(offset)
    const currentLine = model.getLineContent(position.lineNumber)

    const context: CodeContext = {
      beforeCursor,
      afterCursor,
      currentLine,
      language: model.getLanguageId(),
      fileName: model.uri.path,
      imports: this.extractImports(fullText),
      functions: this.extractFunctions(fullText),
      variables: this.extractVariables(fullText),
    }

    return context
  }

  /**
   * 提取导入语句
   */
  private extractImports(code: string): string[] {
    const imports: string[] = []
    const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g
    const requireRegex = /require\(['"](.*?)['"]\)/g

    let match

    // ES6 imports
    while ((match = importRegex.exec(code)) !== null) {
      imports.push(match[1])
    }

    // CommonJS requires
    while ((match = requireRegex.exec(code)) !== null) {
      imports.push(match[1])
    }

    return [...new Set(imports)]
  }

  /**
   * 提取函数定义
   */
  private extractFunctions(code: string): string[] {
    const functions: string[] = []

    // 函数声明
    const functionRegex = /function\s+(\w+)\s*\(/g
    // 箭头函数
    const arrowFunctionRegex = /(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g
    // 类方法
    const methodRegex = /(\w+)\s*\([^)]*\)\s*\{/g

    let match

    while ((match = functionRegex.exec(code)) !== null) {
      functions.push(match[1])
    }

    while ((match = arrowFunctionRegex.exec(code)) !== null) {
      functions.push(match[1])
    }

    while ((match = methodRegex.exec(code)) !== null) {
      if (!['if', 'for', 'while', 'switch'].includes(match[1])) {
        functions.push(match[1])
      }
    }

    return [...new Set(functions)]
  }

  /**
   * 提取变量声明
   */
  private extractVariables(code: string): string[] {
    const variables: string[] = []
    const variableRegex = /(?:const|let|var)\s+(\w+)/g

    let match

    while ((match = variableRegex.exec(code)) !== null) {
      variables.push(match[1])
    }

    return [...new Set(variables)]
  }

  /**
   * 获取当前作用域
   */
  getCurrentScope(model: Monaco.editor.ITextModel, position: Monaco.Position): string {
    const fullText = model.getValue()
    const offset = model.getOffsetAt(position)
    const beforeCursor = fullText.substring(0, offset)

    // 简单的作用域检测（基于花括号）
    let braceCount = 0
    let scopeStart = 0

    for (let i = beforeCursor.length - 1; i >= 0; i--) {
      if (beforeCursor[i] === '}') {
        braceCount++
      } else if (beforeCursor[i] === '{') {
        if (braceCount === 0) {
          scopeStart = i
          break
        }
        braceCount--
      }
    }

    return fullText.substring(scopeStart, offset)
  }

  /**
   * 检测当前位置的上下文类型
   */
  detectContextType(context: CodeContext): 'import' | 'function' | 'class' | 'variable' | 'comment' | 'string' | 'unknown' {
    const { currentLine, beforeCursor } = context

    // 检测注释
    if (currentLine.trim().startsWith('//') || currentLine.trim().startsWith('/*')) {
      return 'comment'
    }

    // 检测字符串
    const stringMatch = beforeCursor.match(/['"`](?:[^'"`\\]|\\.)*$/)
    if (stringMatch) {
      return 'string'
    }

    // 检测导入
    if (currentLine.includes('import') || currentLine.includes('require')) {
      return 'import'
    }

    // 检测函数
    if (currentLine.includes('function') || /=>\s*{?$/.test(beforeCursor)) {
      return 'function'
    }

    // 检测类
    if (currentLine.includes('class')) {
      return 'class'
    }

    // 检测变量
    if (/(?:const|let|var)\s+\w*$/.test(beforeCursor)) {
      return 'variable'
    }

    return 'unknown'
  }

  /**
   * 获取光标前的词
   */
  getWordBeforeCursor(model: Monaco.editor.ITextModel, position: Monaco.Position): string {
    const lineContent = model.getLineContent(position.lineNumber)
    const wordRegex = /[\w.]+$/
    const match = lineContent.substring(0, position.column - 1).match(wordRegex)

    return match ? match[0] : ''
  }

  /**
   * 获取可用的补全上下文
   */
  getCompletionContext(context: CodeContext): {
    inFunction: boolean
    inClass: boolean
    inString: boolean
    inComment: boolean
    availableVariables: string[]
    availableFunctions: string[]
  } {
    const contextType = this.detectContextType(context)

    return {
      inFunction: contextType === 'function',
      inClass: contextType === 'class',
      inString: contextType === 'string',
      inComment: contextType === 'comment',
      availableVariables: context.variables || [],
      availableFunctions: context.functions || [],
    }
  }
}

