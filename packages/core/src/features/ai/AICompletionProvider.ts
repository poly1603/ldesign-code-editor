/**
 * AI 代码补全提供器
 * 集成到 Monaco Editor 的补全系统
 */

import type * as Monaco from 'monaco-editor'
import type { AIService } from './AIService'
import type { CodeContext, AICompletionItem } from '../../types/ai'
import { ContextAnalyzer } from './ContextAnalyzer'

export interface AICompletionProviderOptions {
  aiService: AIService
  triggerCharacters?: string[]
  debounceDelay?: number
  maxSuggestions?: number
  enableInlineCompletion?: boolean
}

/**
 * AI 代码补全提供器类
 */
export class AICompletionProvider {
  private aiService: AIService
  private contextAnalyzer: ContextAnalyzer
  private options: Required<AICompletionProviderOptions>
  private debounceTimer: ReturnType<typeof setTimeout> | null = null

  constructor(options: AICompletionProviderOptions) {
    this.aiService = options.aiService
    this.contextAnalyzer = new ContextAnalyzer()
    this.options = {
      aiService: options.aiService,
      triggerCharacters: options.triggerCharacters || ['.', '(', ' '],
      debounceDelay: options.debounceDelay || 300,
      maxSuggestions: options.maxSuggestions || 5,
      enableInlineCompletion: options.enableInlineCompletion !== false,
    }
  }

  /**
   * 注册到 Monaco Editor
   */
  register(monaco: typeof Monaco, language: string): Monaco.IDisposable {
    return monaco.languages.registerCompletionItemProvider(language, {
      triggerCharacters: this.options.triggerCharacters,

      provideCompletionItems: async (model, position, _context, token) => {
        return new Promise((resolve) => {
          // 清除之前的计时器
          if (this.debounceTimer) {
            clearTimeout(this.debounceTimer)
          }

          // 防抖
          this.debounceTimer = setTimeout(async () => {
            if (token.isCancellationRequested) {
              resolve({ suggestions: [] })
              return
            }

            try {
              const context = this.contextAnalyzer.analyzeContext(model, position)
              const suggestions = await this.getAICompletions(context)

              const monacoSuggestions: Monaco.languages.CompletionItem[] = suggestions.map((item) => ({
                label: item.displayText || item.text,
                kind: this.mapKind(item.kind),
                insertText: item.text,
                documentation: item.documentation,
                sortText: `${1000 - item.score}`,
                range: {
                  startLineNumber: position.lineNumber,
                  startColumn: position.column,
                  endLineNumber: position.lineNumber,
                  endColumn: position.column,
                },
              }))

              resolve({
                suggestions: monacoSuggestions,
              })
            } catch (error) {
              console.error('AI completion error:', error)
              resolve({ suggestions: [] })
            }
          }, this.options.debounceDelay)
        })
      },
    })
  }

  /**
   * 注册内联补全
   */
  registerInlineCompletion(monaco: typeof Monaco, language: string): Monaco.IDisposable | null {
    if (!this.options.enableInlineCompletion) {
      return null
    }

    // Monaco Editor v0.34+ 支持内联补全
    if (!monaco.languages.registerInlineCompletionsProvider) {
      return null
    }

    return monaco.languages.registerInlineCompletionsProvider(language, {
      provideInlineCompletions: async (model, position, _context, token) => {
        if (token.isCancellationRequested) {
          return { items: [] }
        }

        try {
          const context = this.contextAnalyzer.analyzeContext(model, position)
          const completion = await this.aiService.getCompletion({
            prompt: context.beforeCursor,
            context: this.buildContextString(context),
            language: context.language,
          })

          return {
            items: [
              {
                insertText: completion.completion,
                range: {
                  startLineNumber: position.lineNumber,
                  startColumn: position.column,
                  endLineNumber: position.lineNumber,
                  endColumn: position.column,
                },
              },
            ],
          }
        } catch (error) {
          console.error('AI inline completion error:', error)
          return { items: [] }
        }
      },

      freeInlineCompletions: () => {
        // 清理资源
      },
    })
  }

  /**
   * 获取 AI 补全
   */
  private async getAICompletions(context: CodeContext): Promise<AICompletionItem[]> {
    try {
      const response = await this.aiService.getCompletion({
        prompt: context.beforeCursor,
        context: this.buildContextString(context),
        language: context.language,
        maxTokens: 50,
      })

      // 解析补全结果
      const items: AICompletionItem[] = [
        {
          text: response.completion,
          displayText: response.completion.split('\n')[0],
          documentation: 'AI-generated completion',
          kind: this.inferKind(response.completion),
          score: (response.confidence || 0.5) * 100,
        },
      ]

      // 添加替代建议
      if (response.alternatives) {
        response.alternatives.forEach((alt, index) => {
          items.push({
            text: alt,
            displayText: alt.split('\n')[0],
            documentation: 'AI-generated alternative',
            kind: this.inferKind(alt),
            score: (response.confidence || 0.5) * 100 - (index + 1) * 10,
          })
        })
      }

      return items.slice(0, this.options.maxSuggestions)
    } catch (error) {
      console.error('Failed to get AI completions:', error)
      return []
    }
  }

  /**
   * 构建上下文字符串
   */
  private buildContextString(context: CodeContext): string {
    let contextStr = ''

    if (context.imports && context.imports.length > 0) {
      contextStr += `Imports: ${context.imports.join(', ')}\n`
    }

    if (context.functions && context.functions.length > 0) {
      contextStr += `Functions: ${context.functions.join(', ')}\n`
    }

    if (context.variables && context.variables.length > 0) {
      contextStr += `Variables: ${context.variables.join(', ')}\n`
    }

    return contextStr
  }

  /**
   * 推断补全类型
   */
  private inferKind(text: string): AICompletionItem['kind'] {
    if (text.includes('function') || text.includes('=>')) {
      return 'function'
    }
    if (text.includes('class')) {
      return 'class'
    }
    if (text.includes('const') || text.includes('let') || text.includes('var')) {
      return 'variable'
    }
    if (text.includes('(') && text.includes(')')) {
      return 'method'
    }
    return 'snippet'
  }

  /**
   * 映射到 Monaco 类型
   */
  private mapKind(kind: AICompletionItem['kind']): Monaco.languages.CompletionItemKind {
    const monaco = (globalThis as { monaco?: typeof Monaco }).monaco

    if (!monaco) {
      return 0
    }

    const kindMap: Record<AICompletionItem['kind'], Monaco.languages.CompletionItemKind> = {
      method: monaco.languages.CompletionItemKind.Method,
      function: monaco.languages.CompletionItemKind.Function,
      property: monaco.languages.CompletionItemKind.Property,
      variable: monaco.languages.CompletionItemKind.Variable,
      class: monaco.languages.CompletionItemKind.Class,
      snippet: monaco.languages.CompletionItemKind.Snippet,
    }

    return kindMap[kind] || monaco.languages.CompletionItemKind.Text
  }

  /**
   * 清理资源
   */
  dispose(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }
  }
}

