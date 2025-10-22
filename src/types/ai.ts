/**
 * AI 相关类型定义
 */

export interface AIConfig {
  provider: 'openai' | 'claude' | 'custom'
  apiKey: string
  model?: string
  baseURL?: string
  maxTokens?: number
  temperature?: number
  timeout?: number
}

export interface AICompletionRequest {
  prompt: string
  context?: string
  language?: string
  maxTokens?: number
  temperature?: number
  stopSequences?: string[]
}

export interface AICompletionResponse {
  completion: string
  confidence?: number
  alternatives?: string[]
  metadata?: Record<string, unknown>
}

export interface AIError {
  code: string
  message: string
  details?: unknown
}

export interface CodeContext {
  beforeCursor: string
  afterCursor: string
  currentLine: string
  fileName?: string
  language?: string
  imports?: string[]
  functions?: string[]
  variables?: string[]
}

export interface AICompletionItem {
  text: string
  displayText?: string
  documentation?: string
  kind: 'method' | 'function' | 'property' | 'variable' | 'class' | 'snippet'
  score: number
}

export interface NaturalLanguageRequest {
  query: string
  context?: CodeContext
  targetLanguage?: string
}

export interface CodeExplanation {
  summary: string
  details: string
  complexity?: 'low' | 'medium' | 'high'
  suggestions?: string[]
}

export interface CodeDocumentation {
  description: string
  parameters?: Array<{
    name: string
    type: string
    description: string
  }>
  returns?: {
    type: string
    description: string
  }
  examples?: string[]
  tags?: string[]
}

