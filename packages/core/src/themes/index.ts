import * as monaco from 'monaco-editor'
import type { EditorTheme } from '../types'
import { githubLight, githubDark } from './github'
import { oneDark } from './onedark'
import { dracula } from './dracula'
import { nord } from './nord'
import { monokai } from './monokai'

/**
 * Default built-in themes
 */
export const defaultThemes = {
  'vs': 'vs',
  'vs-dark': 'vs-dark',
  'hc-black': 'hc-black',
  'hc-light': 'hc-light'
} as const

// Theme registry
const themes = new Map<string, EditorTheme>()

// Built-in custom themes
const builtInThemes: EditorTheme[] = [
  githubLight,
  githubDark,
  oneDark,
  dracula,
  nord,
  monokai
]

let themesRegistered = false

function ensureThemesRegistered(): void {
  if (themesRegistered) return

  builtInThemes.forEach(theme => {
    registerTheme(theme)
  })

  themesRegistered = true
}

/**
 * Register a custom theme
 */
export function registerTheme(theme: EditorTheme): void {
  monaco.editor.defineTheme(theme.name, {
    base: theme.base,
    inherit: theme.inherit,
    rules: theme.rules,
    colors: theme.colors
  })
  themes.set(theme.name, theme)
}

/**
 * Get a registered theme
 */
export function getTheme(name: string): EditorTheme | undefined {
  ensureThemesRegistered()
  return themes.get(name)
}

/**
 * Get all available theme names
 */
export function getAvailableThemes(): string[] {
  ensureThemesRegistered()
  return [
    ...Object.keys(defaultThemes),
    ...Array.from(themes.keys())
  ]
}

/**
 * Check if a theme exists
 */
export function hasTheme(name: string): boolean {
  ensureThemesRegistered()
  return name in defaultThemes || themes.has(name)
}

// Auto-register themes on import
ensureThemesRegistered()

// Export individual themes
export { githubLight, githubDark } from './github'
export { oneDark } from './onedark'
export { dracula } from './dracula'
export { nord } from './nord'
export { monokai } from './monokai'
