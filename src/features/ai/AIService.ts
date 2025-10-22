/**
 * AI 服务
 * 提供 AI 功能的统一接口
 */

import type {
  AIConfig,
  AICompletionRequest,
  AICompletionResponse,
  AIError,
  CodeContext,
  NaturalLanguageRequest,
  CodeExplanation,
  CodeDocumentation,
} from '../../types/ai'

/**
 * AI 服务类
 */
export class AIService {
  private config: AIConfig
  private requestQueue: Array<() => Promise<unknown>> = []
  private isProcessing = false
  private rateLimitDelay = 1000 // 1 second between requests

  constructor(config: AIConfig) {
    this.config = config
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<AIConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * 获取代码补全
   */
  async getCompletion(request: AICompletionRequest): Promise<AICompletionResponse> {
    return this.queueRequest(async () => {
      try {
        const response = await this.makeAPIRequest('completions', {
          prompt: this.buildPrompt(request),
          max_tokens: request.maxTokens || this.config.maxTokens || 100,
          temperature: request.temperature || this.config.temperature || 0.7,
          stop: request.stopSequences || ['\n\n'],
        })

        return {
          completion: response.choices[0].text.trim(),
          confidence: response.choices[0].finish_reason === 'stop' ? 0.9 : 0.7,
          alternatives: response.choices.slice(1).map((c: { text: string }) => c.text.trim()),
          metadata: {
            model: response.model,
            usage: response.usage,
          },
        }
      } catch (error) {
        throw this.handleError(error)
      }
    })
  }

  /**
   * 自然语言转代码
   */
  async naturalLanguageToCode(request: NaturalLanguageRequest): Promise<string> {
    return this.queueRequest(async () => {
      const prompt = this.buildNL2CodePrompt(request)

      try {
        const response = await this.makeAPIRequest('completions', {
          prompt,
          max_tokens: 200,
          temperature: 0.5,
        })

        return response.choices[0].text.trim()
      } catch (error) {
        throw this.handleError(error)
      }
    })
  }

  /**
   * 解释代码
   */
  async explainCode(code: string, context?: CodeContext): Promise<CodeExplanation> {
    return this.queueRequest(async () => {
      const prompt = `Explain the following ${context?.language || ''} code:\n\n${code}\n\nProvide a clear explanation of what this code does:`

      try {
        const response = await this.makeAPIRequest('completions', {
          prompt,
          max_tokens: 300,
          temperature: 0.3,
        })

        const explanation = response.choices[0].text.trim()

        return {
          summary: explanation.split('\n')[0],
          details: explanation,
          complexity: this.assessComplexity(code),
          suggestions: this.extractSuggestions(explanation),
        }
      } catch (error) {
        throw this.handleError(error)
      }
    })
  }

  /**
   * 生成文档
   */
  async generateDocumentation(code: string, language?: string): Promise<CodeDocumentation> {
    return this.queueRequest(async () => {
      const prompt = `Generate JSDoc/documentation for the following ${language || ''} code:\n\n${code}\n\nProvide comprehensive documentation:`

      try {
        const response = await this.makeAPIRequest('completions', {
          prompt,
          max_tokens: 400,
          temperature: 0.3,
        })

        const documentation = response.choices[0].text.trim()

        return this.parseDocumentation(documentation)
      } catch (error) {
        throw this.handleError(error)
      }
    })
  }

  /**
   * 修复代码错误
   */
  async fixCode(code: string, error: string, language?: string): Promise<string> {
    return this.queueRequest(async () => {
      const prompt = `Fix the following ${language || ''} code that has this error: "${error}"\n\nCode:\n${code}\n\nFixed code:`

      try {
        const response = await this.makeAPIRequest('completions', {
          prompt,
          max_tokens: 300,
          temperature: 0.5,
        })

        return response.choices[0].text.trim()
      } catch (error) {
        throw this.handleError(error)
      }
    })
  }

  /**
   * 优化代码
   */
  async optimizeCode(code: string, language?: string): Promise<string> {
    return this.queueRequest(async () => {
      const prompt = `Optimize the following ${language || ''} code for better performance and readability:\n\n${code}\n\nOptimized code:`

      try {
        const response = await this.makeAPIRequest('completions', {
          prompt,
          max_tokens: 400,
          temperature: 0.5,
        })

        return response.choices[0].text.trim()
      } catch (error) {
        throw this.handleError(error)
      }
    })
  }

  /**
   * 队列请求
   */
  private async queueRequest<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await request()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })

      this.processQueue()
    })
  }

  /**
   * 处理请求队列
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return
    }

    this.isProcessing = true

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift()
      if (request) {
        await request()
        await this.delay(this.rateLimitDelay)
      }
    }

    this.isProcessing = false
  }

  /**
   * 发起 API 请求
   */
  private async makeAPIRequest(endpoint: string, data: Record<string, unknown>): Promise<{
    choices: Array<{ text: string; finish_reason: string }>
    model: string
    usage: Record<string, unknown>
  }> {
    const url = this.buildURL(endpoint)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-3.5-turbo',
        ...data,
      }),
      signal: AbortSignal.timeout(this.config.timeout || 30000),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return await response.json()
  }

  /**
   * 构建 URL
   */
  private buildURL(endpoint: string): string {
    const baseURL = this.config.baseURL || this.getDefaultBaseURL()
    return `${baseURL}/${endpoint}`
  }

  /**
   * 获取默认 Base URL
   */
  private getDefaultBaseURL(): string {
    switch (this.config.provider) {
      case 'openai':
        return 'https://api.openai.com/v1'
      case 'claude':
        return 'https://api.anthropic.com/v1'
      default:
        throw new Error('Unknown AI provider or missing baseURL')
    }
  }

  /**
   * 构建提示词
   */
  private buildPrompt(request: AICompletionRequest): string {
    let prompt = ''

    if (request.context) {
      prompt += `Context:\n${request.context}\n\n`
    }

    if (request.language) {
      prompt += `Language: ${request.language}\n\n`
    }

    prompt += `Complete the following code:\n${request.prompt}`

    return prompt
  }

  /**
   * 构建自然语言转代码提示词
   */
  private buildNL2CodePrompt(request: NaturalLanguageRequest): string {
    let prompt = `Convert the following natural language description to ${request.targetLanguage || 'JavaScript'} code:\n\n`
    prompt += `"${request.query}"\n\n`

    if (request.context) {
      prompt += `Context:\n`
      prompt += `File: ${request.context.fileName || 'unknown'}\n`
      prompt += `Language: ${request.context.language || 'unknown'}\n\n`
    }

    prompt += `Code:`

    return prompt
  }

  /**
   * 评估代码复杂度
   */
  private assessComplexity(code: string): 'low' | 'medium' | 'high' {
    const lines = code.split('\n').length
    const nestedBlocks = (code.match(/\{/g) || []).length

    if (lines < 10 && nestedBlocks < 3) {
      return 'low'
    } else if (lines < 50 && nestedBlocks < 10) {
      return 'medium'
    } else {
      return 'high'
    }
  }

  /**
   * 提取建议
   */
  private extractSuggestions(explanation: string): string[] {
    const suggestions: string[] = []
    const lines = explanation.split('\n')

    for (const line of lines) {
      if (line.includes('consider') || line.includes('should') || line.includes('could')) {
        suggestions.push(line.trim())
      }
    }

    return suggestions
  }

  /**
   * 解析文档
   */
  private parseDocumentation(documentation: string): CodeDocumentation {
    // 简单解析，实际应该更复杂
    const lines = documentation.split('\n')

    return {
      description: lines[0] || '',
      parameters: [],
      examples: [],
      tags: [],
    }
  }

  /**
   * 处理错误
   */
  private handleError(error: unknown): AIError {
    if (error instanceof Error) {
      return {
        code: 'AI_ERROR',
        message: error.message,
        details: error,
      }
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      details: error,
    }
  }

  /**
   * 延迟
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * 取消所有请求
   */
  cancelAll(): void {
    this.requestQueue = []
  }

  /**
   * 获取队列大小
   */
  getQueueSize(): number {
    return this.requestQueue.length
  }
}

