/**
 * Rust 语言服务
 */

import * as monaco from 'monaco-editor'

export class RustLanguageService {
  register(): void {
    monaco.languages.registerCompletionItemProvider('rust', {
      provideCompletionItems: () => {
        const suggestions = [
          {
            label: 'fn',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'fn ${1:name}(${2:params}) ${3:-> ReturnType} {\n\t${0}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Function definition',
          },
          {
            label: 'struct',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'struct ${1:Name} {\n\t${0}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Struct definition',
          },
        ]
        return { suggestions }
      },
    })
  }
}

