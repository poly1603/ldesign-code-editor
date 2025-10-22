/**
 * 代码片段管理器
 */

import * as monaco from 'monaco-editor'
import { SnippetLibrary } from './SnippetLibrary'
import type { Snippet } from './SnippetLibrary'

export class SnippetManager {
  private library = new SnippetLibrary()
  private disposables: monaco.IDisposable[] = []

  registerSnippets(language: string, snippets: Snippet[]): void {
    snippets.forEach((s) => {
      this.library.addSnippet({ ...s, language })
    })

    const disposable = monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        }

        const languageSnippets = this.library.getSnippetsByLanguage(language)
        const suggestions = languageSnippets.map((s) => ({
          label: s.prefix,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: Array.isArray(s.body) ? s.body.join('\n') : s.body,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: s.description || s.name,
          range,
        }))

        return { suggestions }
      },
    })

    this.disposables.push(disposable)
  }

  getLibrary(): SnippetLibrary {
    return this.library
  }

  dispose(): void {
    this.disposables.forEach((d) => d.dispose())
    this.disposables = []
  }
}

