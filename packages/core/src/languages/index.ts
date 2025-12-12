import * as monaco from 'monaco-editor'
import type { EditorLanguage } from '../types'
import { vueLanguage, registerVueLanguage } from './extensions/vue'
import { svelteLanguage, registerSvelteLanguage } from './extensions/svelte'
import { prismaLanguage, registerPrismaLanguage } from './extensions/prisma'
import { graphqlLanguage, registerGraphqlLanguage } from './extensions/graphql'
import { tomlLanguage, registerTomlLanguage } from './extensions/toml'
import { dotenvLanguage, registerDotenvLanguage } from './extensions/dotenv'

/**
 * Default supported languages in Monaco Editor
 */
export const defaultLanguages = [
  'javascript',
  'typescript',
  'html',
  'css',
  'scss',
  'less',
  'json',
  'xml',
  'markdown',
  'yaml',
  'python',
  'java',
  'c',
  'cpp',
  'csharp',
  'go',
  'rust',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'sql',
  'shell',
  'powershell',
  'dockerfile',
  'plaintext'
] as const

export type DefaultLanguage = typeof defaultLanguages[number]

// Custom language registry
const customLanguages = new Map<string, EditorLanguage>()

// Built-in extended languages
const extendedLanguages: EditorLanguage[] = [
  vueLanguage,
  svelteLanguage,
  prismaLanguage,
  graphqlLanguage,
  tomlLanguage,
  dotenvLanguage
]

let languagesRegistered = false

/**
 * Ensure all extended languages are registered
 */
function ensureLanguagesRegistered(): void {
  if (languagesRegistered) return

  // Register Vue
  registerVueLanguage()
  customLanguages.set('vue', vueLanguage)

  // Register Svelte
  registerSvelteLanguage()
  customLanguages.set('svelte', svelteLanguage)

  // Register Prisma
  registerPrismaLanguage()
  customLanguages.set('prisma', prismaLanguage)

  // Register GraphQL
  registerGraphqlLanguage()
  customLanguages.set('graphql', graphqlLanguage)

  // Register TOML
  registerTomlLanguage()
  customLanguages.set('toml', tomlLanguage)

  // Register Dotenv
  registerDotenvLanguage()
  customLanguages.set('dotenv', dotenvLanguage)

  languagesRegistered = true
}

/**
 * Register a custom language
 */
export function registerLanguage(language: EditorLanguage): void {
  // Register the language
  monaco.languages.register({
    id: language.id,
    extensions: language.extensions,
    aliases: language.aliases,
    mimetypes: language.mimetypes
  })

  // Register language configuration if provided
  if (language.configuration) {
    monaco.languages.setLanguageConfiguration(language.id, language.configuration as monaco.languages.LanguageConfiguration)
  }

  // Register monarch tokenizer if provided
  if (language.monarchTokens) {
    monaco.languages.setMonarchTokensProvider(language.id, language.monarchTokens as monaco.languages.IMonarchLanguage)
  }

  customLanguages.set(language.id, language)
}

/**
 * Get language info
 */
export function getLanguage(id: string): EditorLanguage | undefined {
  ensureLanguagesRegistered()
  return customLanguages.get(id)
}

/**
 * Get all available languages
 */
export function getAvailableLanguages(): string[] {
  ensureLanguagesRegistered()
  return [
    ...defaultLanguages,
    ...Array.from(customLanguages.keys())
  ]
}

/**
 * Check if a language is registered
 */
export function hasLanguage(id: string): boolean {
  ensureLanguagesRegistered()
  return defaultLanguages.includes(id as DefaultLanguage) || customLanguages.has(id)
}

/**
 * Detect language from file extension
 */
export function detectLanguage(filename: string): string {
  ensureLanguagesRegistered()

  const ext = filename.split('.').pop()?.toLowerCase()

  const extensionMap: Record<string, string> = {
    // JavaScript/TypeScript
    'js': 'javascript',
    'mjs': 'javascript',
    'cjs': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'mts': 'typescript',
    'cts': 'typescript',
    // Web
    'html': 'html',
    'htm': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'scss',
    'less': 'less',
    // Data formats
    'json': 'json',
    'jsonc': 'json',
    'json5': 'json',
    'xml': 'xml',
    'svg': 'xml',
    'md': 'markdown',
    'markdown': 'markdown',
    'mdx': 'markdown',
    'yml': 'yaml',
    'yaml': 'yaml',
    'toml': 'toml',
    'env': 'dotenv',
    // Programming languages
    'py': 'python',
    'pyw': 'python',
    'java': 'java',
    'c': 'c',
    'h': 'c',
    'cpp': 'cpp',
    'cc': 'cpp',
    'cxx': 'cpp',
    'hpp': 'cpp',
    'hxx': 'cpp',
    'cs': 'csharp',
    'go': 'go',
    'rs': 'rust',
    'php': 'php',
    'rb': 'ruby',
    'swift': 'swift',
    'kt': 'kotlin',
    'kts': 'kotlin',
    // Query languages
    'sql': 'sql',
    'graphql': 'graphql',
    'gql': 'graphql',
    'prisma': 'prisma',
    // Shell
    'sh': 'shell',
    'bash': 'shell',
    'zsh': 'shell',
    'ps1': 'powershell',
    'psm1': 'powershell',
    // Config
    'dockerfile': 'dockerfile',
    // Framework-specific
    'vue': 'vue',
    'svelte': 'svelte'
  }

  // Check custom languages first
  for (const lang of customLanguages.values()) {
    if (lang.extensions?.some(e => e.replace('.', '') === ext)) {
      return lang.id
    }
  }

  return ext ? (extensionMap[ext] || 'plaintext') : 'plaintext'
}

/**
 * Get language configuration
 */
export function getLanguageConfiguration(id: string): EditorLanguage['configuration'] | undefined {
  ensureLanguagesRegistered()
  const customLang = customLanguages.get(id)
  return customLang?.configuration
}

// Auto-register languages on import
ensureLanguagesRegistered()

// Export language definitions
export { vueLanguage } from './extensions/vue'
export { svelteLanguage } from './extensions/svelte'
export { prismaLanguage } from './extensions/prisma'
export { graphqlLanguage } from './extensions/graphql'
export { tomlLanguage } from './extensions/toml'
export { dotenvLanguage } from './extensions/dotenv'
