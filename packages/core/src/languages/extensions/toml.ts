import * as monaco from 'monaco-editor'
import type { EditorLanguage, LanguageConfiguration, MonarchLanguage } from '../../types'

/**
 * TOML language definition
 */
export const tomlLanguage: EditorLanguage = {
  id: 'toml',
  extensions: ['.toml'],
  aliases: ['TOML', 'toml'],
  mimetypes: ['text/x-toml', 'application/toml'],
  configuration: {
    comments: {
      lineComment: '#'
    },
    brackets: [
      ['[', ']'],
      ['{', '}']
    ],
    autoClosingPairs: [
      { open: '[', close: ']' },
      { open: '{', close: '}' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '"""', close: '"""' },
      { open: "'''", close: "'''" }
    ],
    surroundingPairs: [
      { open: '[', close: ']' },
      { open: '{', close: '}' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ]
  } as LanguageConfiguration,
  monarchTokens: {
    defaultToken: '',
    tokenPostfix: '.toml',

    tokenizer: {
      root: [
        // Comments
        [/#.*$/, 'comment'],

        // Tables
        [/\[\[[\w.-]+\]\]/, 'tag'],
        [/\[[\w.-]+\]/, 'tag'],

        // Keys
        [/[\w-]+(?=\s*=)/, 'variable'],

        // Booleans
        [/\b(true|false)\b/, 'keyword'],

        // Dates
        [/\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(.\d+)?(Z|[+-]\d{2}:\d{2})?)?/, 'number'],

        // Numbers
        [/[+-]?(\d+\.?\d*([eE][+-]?\d+)?|inf|nan)/, 'number'],
        [/0x[0-9a-fA-F_]+/, 'number'],
        [/0o[0-7_]+/, 'number'],
        [/0b[01_]+/, 'number'],

        // Multi-line strings
        [/"""/, 'string', '@mlstring'],
        [/'''/, 'string', '@mlstring_literal'],

        // Strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/"/, 'string', '@string'],
        [/'[^']*'/, 'string'],

        // Operators
        [/=/, 'operator'],

        // Delimiters
        [/[{}\[\],]/, 'delimiter']
      ],

      string: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, 'string', '@pop']
      ],

      mlstring: [
        [/[^"]+/, 'string'],
        [/"""/, 'string', '@pop'],
        [/"/, 'string']
      ],

      mlstring_literal: [
        [/[^']+/, 'string'],
        [/'''/, 'string', '@pop'],
        [/'/, 'string']
      ]
    }
  } as MonarchLanguage
}

/**
 * Register TOML language with Monaco
 */
export function registerTomlLanguage(): void {
  monaco.languages.register({
    id: tomlLanguage.id,
    extensions: tomlLanguage.extensions,
    aliases: tomlLanguage.aliases,
    mimetypes: tomlLanguage.mimetypes
  })

  if (tomlLanguage.configuration) {
    monaco.languages.setLanguageConfiguration(
      tomlLanguage.id,
      tomlLanguage.configuration as monaco.languages.LanguageConfiguration
    )
  }

  if (tomlLanguage.monarchTokens) {
    monaco.languages.setMonarchTokensProvider(
      tomlLanguage.id,
      tomlLanguage.monarchTokens as monaco.languages.IMonarchLanguage
    )
  }
}
