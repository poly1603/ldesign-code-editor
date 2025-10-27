/**
 * 主题编辑器
 */

import * as monaco from 'monaco-editor'

export interface ThemeData {
  base: 'vs' | 'vs-dark' | 'hc-black' | 'hc-light'
  inherit: boolean
  rules: monaco.editor.ITokenThemeRule[]
  colors: monaco.editor.IColors
}

export class ThemeEditor {
  private currentTheme: ThemeData | null = null

  loadTheme(themeName: string): ThemeData | null {
    // 从 Monaco 获取当前主题数据
    this.currentTheme = {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    }
    return this.currentTheme
  }

  updateTheme(theme: Partial<ThemeData>): void {
    if (this.currentTheme) {
      this.currentTheme = { ...this.currentTheme, ...theme }
    }
  }

  previewTheme(theme: ThemeData, themeName: string): void {
    monaco.editor.defineTheme(themeName, theme)
    monaco.editor.setTheme(themeName)
  }

  exportTheme(): string {
    if (!this.currentTheme) {
      throw new Error('No theme loaded')
    }
    return JSON.stringify(this.currentTheme, null, 2)
  }

  importTheme(json: string): ThemeData {
    const theme = JSON.parse(json) as ThemeData
    this.currentTheme = theme
    return theme
  }

  saveTheme(name: string): void {
    if (!this.currentTheme) return
    localStorage.setItem(`theme:${name}`, JSON.stringify(this.currentTheme))
  }

  listSavedThemes(): string[] {
    const themes: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('theme:')) {
        themes.push(key.replace('theme:', ''))
      }
    }
    return themes
  }
}

