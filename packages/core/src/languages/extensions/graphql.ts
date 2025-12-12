import * as monaco from 'monaco-editor'
import type { EditorLanguage, LanguageConfiguration, MonarchLanguage } from '../../types'

/**
 * GraphQL language definition
 */
export const graphqlLanguage: EditorLanguage = {
  id: 'graphql',
  extensions: ['.graphql', '.gql'],
  aliases: ['GraphQL', 'graphql', 'gql'],
  mimetypes: ['application/graphql'],
  configuration: {
    comments: {
      lineComment: '#'
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
      { open: '"', close: '"' },
      { open: '"""', close: '"""' }
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
    tokenPostfix: '.graphql',

    keywords: [
      'query', 'mutation', 'subscription', 'fragment', 'on',
      'type', 'interface', 'union', 'enum', 'scalar', 'input',
      'extend', 'implements', 'directive', 'schema',
      'true', 'false', 'null'
    ],

    typeKeywords: [
      'Int', 'Float', 'String', 'Boolean', 'ID'
    ],

    operators: ['=', '!', ':', '@', '|', '&', '...'],

    tokenizer: {
      root: [
        // Comments
        [/#.*$/, 'comment'],

        // Doc strings
        [/"""/, 'string', '@docstring'],

        // Strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/"/, 'string', '@string'],

        // Keywords
        [/\b(query|mutation|subscription|fragment|on)\b/, 'keyword'],
        [/\b(type|interface|union|enum|scalar|input|extend|implements|directive|schema)\b/, 'keyword'],
        [/\b(true|false|null)\b/, 'keyword'],

        // Built-in types
        [/\b(Int|Float|String|Boolean|ID)\b/, 'type'],

        // Directives
        [/@\w+/, 'annotation'],

        // Variables
        [/\$\w+/, 'variable'],

        // Numbers
        [/-?\d+\.?\d*([eE][+-]?\d+)?/, 'number'],

        // Type names (PascalCase)
        [/[A-Z]\w*/, 'type.identifier'],

        // Field names
        [/[a-z_]\w*(?=\s*[:(])/, 'function'],
        [/[a-z_]\w*/, 'identifier'],

        // Operators
        [/[!:@|&]/, 'operator'],
        [/\.\.\./, 'operator'],

        // Delimiters
        [/[{}()\[\]]/, 'delimiter']
      ],

      string: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, 'string', '@pop']
      ],

      docstring: [
        [/[^"]+/, 'string'],
        [/"""/, 'string', '@pop'],
        [/"/, 'string']
      ]
    }
  } as MonarchLanguage
}

/**
 * Register GraphQL language with Monaco
 */
export function registerGraphqlLanguage(): void {
  monaco.languages.register({
    id: graphqlLanguage.id,
    extensions: graphqlLanguage.extensions,
    aliases: graphqlLanguage.aliases,
    mimetypes: graphqlLanguage.mimetypes
  })

  if (graphqlLanguage.configuration) {
    monaco.languages.setLanguageConfiguration(
      graphqlLanguage.id,
      graphqlLanguage.configuration as monaco.languages.LanguageConfiguration
    )
  }

  if (graphqlLanguage.monarchTokens) {
    monaco.languages.setMonarchTokensProvider(
      graphqlLanguage.id,
      graphqlLanguage.monarchTokens as monaco.languages.IMonarchLanguage
    )
  }
}
