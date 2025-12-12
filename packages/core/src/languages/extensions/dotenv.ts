import * as monaco from 'monaco-editor'
import type { EditorLanguage, LanguageConfiguration, MonarchLanguage } from '../../types'

/**
 * Dotenv (.env) language definition
 */
export const dotenvLanguage: EditorLanguage = {
  id: 'dotenv',
  extensions: ['.env', '.env.local', '.env.development', '.env.production', '.env.test'],
  aliases: ['Dotenv', 'dotenv', 'Environment'],
  mimetypes: ['text/x-dotenv'],
  configuration: {
    comments: {
      lineComment: '#'
    },
    brackets: [],
    autoClosingPairs: [
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
    surroundingPairs: [
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ]
  } as LanguageConfiguration,
  monarchTokens: {
    defaultToken: '',
    tokenPostfix: '.env',

    tokenizer: {
      root: [
        // Comments
        [/#.*$/, 'comment'],

        // Export keyword
        [/^export\s+/, 'keyword'],

        // Variable names
        [/^[\w]+(?==)/, 'variable'],

        // Equals
        [/=/, 'operator'],

        // Quoted strings
        [/"([^"\\]|\\.)*"/, 'string'],
        [/'[^']*'/, 'string'],

        // Variable interpolation
        [/\$\{[\w]+\}/, 'variable'],
        [/\$[\w]+/, 'variable'],

        // Unquoted values
        [/[^\s#]+/, 'string']
      ]
    }
  } as MonarchLanguage
}

/**
 * Register Dotenv language with Monaco
 */
export function registerDotenvLanguage(): void {
  monaco.languages.register({
    id: dotenvLanguage.id,
    extensions: dotenvLanguage.extensions,
    aliases: dotenvLanguage.aliases,
    mimetypes: dotenvLanguage.mimetypes
  })

  if (dotenvLanguage.configuration) {
    monaco.languages.setLanguageConfiguration(
      dotenvLanguage.id,
      dotenvLanguage.configuration as monaco.languages.LanguageConfiguration
    )
  }

  if (dotenvLanguage.monarchTokens) {
    monaco.languages.setMonarchTokensProvider(
      dotenvLanguage.id,
      dotenvLanguage.monarchTokens as monaco.languages.IMonarchLanguage
    )
  }
}
