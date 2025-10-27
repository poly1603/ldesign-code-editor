/**
 * Go 语言服务
 */

import * as monaco from 'monaco-editor'

export class GoLanguageService {
  register(): void {
    monaco.languages.registerCompletionItemProvider('go', {
      provideCompletionItems: () => {
        const suggestions = [
          {
            label: 'func',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'func ${1:name}(${2:params}) ${3:returnType} {\n\t${0}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Function definition',
          },
          {
            label: 'struct',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'type ${1:Name} struct {\n\t${0}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Struct definition',
          },
        ]
        return { suggestions }
      },
    })
  }
}

