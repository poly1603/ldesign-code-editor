/**
 * 扩展系统类型定义
 */

export interface Extension {
  id: string
  name: string
  version: string
  author?: string
  description?: string
  main: string
  activationEvents?: string[]
  contributes?: ExtensionContributes
}

export interface ExtensionContributes {
  commands?: Command[]
  languages?: LanguageContribution[]
  themes?: ThemeContribution[]
  snippets?: SnippetContribution[]
  keybindings?: KeybindingContribution[]
}

export interface Command {
  id: string
  title: string
  category?: string
}

export interface LanguageContribution {
  id: string
  extensions: string[]
  aliases?: string[]
}

export interface ThemeContribution {
  id: string
  label: string
  uiTheme: 'vs' | 'vs-dark'
  path: string
}

export interface SnippetContribution {
  language: string
  path: string
}

export interface KeybindingContribution {
  command: string
  key: string
  when?: string
}

export interface ExtensionContext {
  subscriptions: Array<{ dispose: () => void }>
  extensionPath: string
  globalState: Map<string, unknown>
  workspaceState: Map<string, unknown>
}

export interface ExtensionManifest {
  name: string
  version: string
  main?: string
  browser?: string
  contributes?: ExtensionContributes
}

