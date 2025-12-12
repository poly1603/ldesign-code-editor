import * as monaco from 'monaco-editor'
import type { EditorLanguage, LanguageConfiguration, MonarchLanguage } from '../../types'

/**
 * Prisma Schema language definition
 */
export const prismaLanguage: EditorLanguage = {
  id: 'prisma',
  extensions: ['.prisma'],
  aliases: ['Prisma', 'prisma'],
  mimetypes: ['text/x-prisma'],
  configuration: {
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/']
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')']
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' }
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' }
    ]
  } as LanguageConfiguration,
  monarchTokens: {
    defaultToken: '',
    tokenPostfix: '.prisma',

    keywords: [
      'model', 'enum', 'type', 'datasource', 'generator',
      'true', 'false', 'null'
    ],

    typeKeywords: [
      'String', 'Int', 'Float', 'Boolean', 'DateTime', 'Json',
      'Bytes', 'BigInt', 'Decimal', 'Unsupported'
    ],

    operators: ['=', '@', '@@', '?', '[]'],

    tokenizer: {
      root: [
        // Comments
        [/\/\/.*$/, 'comment'],
        [/\/\*/, 'comment', '@comment'],

        // Keywords
        [/\b(model|enum|type|datasource|generator)\b/, 'keyword'],

        // Types
        [/\b(String|Int|Float|Boolean|DateTime|Json|Bytes|BigInt|Decimal)\b/, 'type'],

        // Attributes
        [/@[\w.]+/, 'annotation'],
        [/@@[\w.]+/, 'annotation'],

        // Field modifiers
        [/\?/, 'operator'],
        [/\[\]/, 'operator'],

        // Strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/"/, 'string', '@string'],

        // Numbers
        [/\d+/, 'number'],

        // Identifiers
        [/[a-zA-Z_]\w*/, 'identifier'],

        // Delimiters
        [/[{}()\[\]]/, 'delimiter'],
        [/[=:]/, 'operator']
      ],

      comment: [
        [/[^/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[/*]/, 'comment']
      ],

      string: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, 'string', '@pop']
      ]
    }
  } as MonarchLanguage
}

/**
 * Register Prisma language with Monaco
 */
export function registerPrismaLanguage(): void {
  monaco.languages.register({
    id: prismaLanguage.id,
    extensions: prismaLanguage.extensions,
    aliases: prismaLanguage.aliases,
    mimetypes: prismaLanguage.mimetypes
  })

  if (prismaLanguage.configuration) {
    monaco.languages.setLanguageConfiguration(
      prismaLanguage.id,
      prismaLanguage.configuration as monaco.languages.LanguageConfiguration
    )
  }

  if (prismaLanguage.monarchTokens) {
    monaco.languages.setMonarchTokensProvider(
      prismaLanguage.id,
      prismaLanguage.monarchTokens as monaco.languages.IMonarchLanguage
    )
  }
}
