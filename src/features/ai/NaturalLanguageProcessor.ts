/**
 * 自然语言处理器
 * 处理自然语言查询并转换为代码
 */

import type { AIService } from './AIService'
import type { NaturalLanguageRequest, CodeContext } from '../../types/ai'

export interface NLProcessorOptions {
  aiService: AIService
  defaultLanguage?: string
  enableTemplates?: boolean
}

/**
 * 自然语言处理器类
 */
export class NaturalLanguageProcessor {
  private aiService: AIService
  private options: Required<NLProcessorOptions>
  private templates = new Map<string, string>()

  constructor(options: NLProcessorOptions) {
    this.aiService = options.aiService
    this.options = {
      aiService: options.aiService,
      defaultLanguage: options.defaultLanguage || 'javascript',
      enableTemplates: options.enableTemplates !== false,
    }

    if (this.options.enableTemplates) {
      this.initializeTemplates()
    }
  }

  /**
   * 初始化模板
   */
  private initializeTemplates(): void {
    this.templates.set('create function', 'function ${name}(${params}) {\n  ${body}\n}')
    this.templates.set('create class', 'class ${name} {\n  constructor(${params}) {\n    ${body}\n  }\n}')
    this.templates.set('create array', 'const ${name} = [${items}]')
    this.templates.set('create object', 'const ${name} = {\n  ${properties}\n}')
    this.templates.set('for loop', 'for (let i = 0; i < ${length}; i++) {\n  ${body}\n}')
    this.templates.set('if statement', 'if (${condition}) {\n  ${body}\n}')
    this.templates.set('try catch', 'try {\n  ${body}\n} catch (error) {\n  ${handler}\n}')
  }

  /**
   * 处理自然语言查询
   */
  async process(query: string, context?: CodeContext): Promise<string> {
    // 尝试匹配模板
    if (this.options.enableTemplates) {
      const template = this.matchTemplate(query)
      if (template) {
        return this.fillTemplate(template, query)
      }
    }

    // 使用 AI 转换
    const request: NaturalLanguageRequest = {
      query,
      context,
      targetLanguage: context?.language || this.options.defaultLanguage,
    }

    return await this.aiService.naturalLanguageToCode(request)
  }

  /**
   * 匹配模板
   */
  private matchTemplate(query: string): string | null {
    const normalizedQuery = query.toLowerCase().trim()

    for (const [pattern, template] of this.templates) {
      if (normalizedQuery.includes(pattern)) {
        return template
      }
    }

    return null
  }

  /**
   * 填充模板
   */
  private fillTemplate(template: string, query: string): string {
    // 简单的模板填充
    let filled = template

    // 提取名称
    const nameMatch = query.match(/(?:named|called)\s+(\w+)/i)
    if (nameMatch) {
      filled = filled.replace('${name}', nameMatch[1])
    } else {
      filled = filled.replace('${name}', 'myFunction')
    }

    // 填充占位符
    filled = filled.replace(/\$\{(\w+)\}/g, (_match, placeholder) => {
      return `/* ${placeholder} */`
    })

    return filled
  }

  /**
   * 解析命令
   */
  parseCommand(query: string): {
    action: string
    target: string
    parameters: Record<string, string>
  } | null {
    const commandPatterns = [
      {
        pattern: /create\s+(?:a\s+)?(\w+)(?:\s+named\s+(\w+))?/i,
        action: 'create',
      },
      {
        pattern: /add\s+(\w+)\s+to\s+(\w+)/i,
        action: 'add',
      },
      {
        pattern: /remove\s+(\w+)\s+from\s+(\w+)/i,
        action: 'remove',
      },
      {
        pattern: /update\s+(\w+)\s+(?:to|with)\s+(.+)/i,
        action: 'update',
      },
    ]

    for (const { pattern, action } of commandPatterns) {
      const match = query.match(pattern)
      if (match) {
        return {
          action,
          target: match[1] || '',
          parameters: this.extractParameters(query),
        }
      }
    }

    return null
  }

  /**
   * 提取参数
   */
  private extractParameters(query: string): Record<string, string> {
    const parameters: Record<string, string> = {}

    // 提取名称
    const nameMatch = query.match(/named\s+(\w+)/i)
    if (nameMatch) {
      parameters.name = nameMatch[1]
    }

    // 提取参数
    const paramsMatch = query.match(/with\s+(?:parameters?|params?)\s+(.+?)(?:\s+that|\s+which|$)/i)
    if (paramsMatch) {
      parameters.params = paramsMatch[1]
    }

    // 提取类型
    const typeMatch = query.match(/of\s+type\s+(\w+)/i)
    if (typeMatch) {
      parameters.type = typeMatch[1]
    }

    return parameters
  }

  /**
   * 生成代码片段
   */
  generateSnippet(command: ReturnType<typeof this.parseCommand>): string {
    if (!command) {
      return ''
    }

    const { action, target, parameters } = command
    const name = parameters.name || 'myVariable'

    switch (action) {
      case 'create':
        return this.generateCreateSnippet(target, name, parameters)

      case 'add':
        return `${target}.push(${name})`

      case 'remove':
        return `${target}.splice(${target}.indexOf(${name}), 1)`

      case 'update':
        return `${target} = ${name}`

      default:
        return ''
    }
  }

  /**
   * 生成创建片段
   */
  private generateCreateSnippet(
    type: string,
    name: string,
    parameters: Record<string, string>
  ): string {
    switch (type.toLowerCase()) {
      case 'function':
        return `function ${name}(${parameters.params || ''}) {\n  // TODO: Implement\n}`

      case 'class':
        return `class ${name} {\n  constructor(${parameters.params || ''}) {\n    // TODO: Implement\n  }\n}`

      case 'variable':
      case 'const':
        return `const ${name} = ${parameters.value || 'null'}`

      case 'array':
        return `const ${name} = []`

      case 'object':
        return `const ${name} = {}`

      default:
        return `// TODO: Create ${type} ${name}`
    }
  }

  /**
   * 验证生成的代码
   */
  async validateCode(code: string, language: string): Promise<boolean> {
    try {
      // 这里可以集成语法检查器
      // 例如：使用 esprima, acorn 等进行 JavaScript 语法检查
      return code.trim().length > 0
    } catch {
      return false
    }
  }

  /**
   * 添加自定义模板
   */
  addTemplate(pattern: string, template: string): void {
    this.templates.set(pattern, template)
  }

  /**
   * 移除模板
   */
  removeTemplate(pattern: string): boolean {
    return this.templates.delete(pattern)
  }

  /**
   * 获取所有模板
   */
  getTemplates(): Map<string, string> {
    return new Map(this.templates)
  }

  /**
   * 清除所有模板
   */
  clearTemplates(): void {
    this.templates.clear()
  }
}

