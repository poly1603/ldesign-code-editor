import * as monaco from 'monaco-editor'
import type { EditorLanguage, LanguageConfiguration, MonarchLanguage } from '../../types'

/**
 * Svelte language definition
 */
export const svelteLanguage: EditorLanguage = {
  id: 'svelte',
  extensions: ['.svelte'],
  aliases: ['Svelte', 'svelte'],
  mimetypes: ['text/x-svelte'],
  configuration: {
    comments: {
      blockComment: ['<!--', '-->']
    },
    brackets: [
      ['<!--', '-->'],
      ['<', '>'],
      ['{', '}'],
      ['[', ']'],
      ['(', ')']
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '`', close: '`' },
      { open: '<!--', close: '-->', notIn: ['comment', 'string'] }
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '`', close: '`' }
    ]
  } as LanguageConfiguration,
  monarchTokens: {
    defaultToken: '',
    tokenPostfix: '.svelte',

    tokenizer: {
      root: [
        // Script block
        [/<script(\s+[^>]*)?>/, { token: 'tag', next: '@script' }],
        // Style block
        [/<style(\s+[^>]*)?>/, { token: 'tag', next: '@style' }],
        // Comments
        [/<!--/, 'comment', '@comment'],
        // Svelte blocks
        [/\{#(if|each|await|key)/, { token: 'keyword', next: '@svelteBlock' }],
        [/\{:(else|then|catch)/, { token: 'keyword' }],
        [/\{\/(if|each|await|key)\}/, 'keyword'],
        // Svelte expressions
        [/\{@(html|debug|const)\s/, { token: 'keyword', next: '@svelteExpression' }],
        // Interpolation
        [/\{/, { token: 'delimiter.bracket', next: '@interpolation' }],
        // HTML tags
        [/<\/?[\w-]+/, 'tag'],
        [/>/, 'tag'],
        // Attributes
        [/(on|bind|class|style|use|transition|in|out|animate):[\w|]+/, 'attribute.name.svelte'],
        [/[\w-]+(?==)/, 'attribute.name'],
        [/"[^"]*"/, 'attribute.value'],
        [/'[^']*'/, 'attribute.value'],
        // Text
        [/[^<{]+/, '']
      ],

      svelteBlock: [
        [/\}/, { token: 'keyword', next: '@pop' }],
        [/./, 'variable']
      ],

      svelteExpression: [
        [/\}/, { token: 'keyword', next: '@pop' }],
        [/./, 'variable']
      ],

      interpolation: [
        [/\}/, { token: 'delimiter.bracket', next: '@pop' }],
        [/[^}]+/, 'variable']
      ],

      script: [
        [/<\/script\s*>/, { token: 'tag', next: '@pop' }],
        [/lang\s*=\s*["']?ts["']?/, { token: 'attribute.value', switchTo: '@scriptTypescript' }],
        [/./, { token: '@rematch', switchTo: '@scriptJavascript' }]
      ],

      scriptJavascript: [
        [/<\/script\s*>/, { token: 'tag', next: '@pop' }],
        [/./, { token: '', nextEmbedded: 'text/javascript' }]
      ],

      scriptTypescript: [
        [/<\/script\s*>/, { token: 'tag', next: '@pop' }],
        [/./, { token: '', nextEmbedded: 'text/typescript' }]
      ],

      style: [
        [/<\/style\s*>/, { token: 'tag', next: '@pop' }],
        [/lang\s*=\s*["']?(scss|sass)["']?/, { token: 'attribute.value', switchTo: '@styleScss' }],
        [/./, { token: '@rematch', switchTo: '@styleCss' }]
      ],

      styleCss: [
        [/<\/style\s*>/, { token: 'tag', next: '@pop' }],
        [/./, { token: '', nextEmbedded: 'text/css' }]
      ],

      styleScss: [
        [/<\/style\s*>/, { token: 'tag', next: '@pop' }],
        [/./, { token: '', nextEmbedded: 'text/x-scss' }]
      ],

      comment: [
        [/-->/, 'comment', '@pop'],
        [/./, 'comment']
      ]
    }
  } as MonarchLanguage
}

/**
 * Register Svelte language with Monaco
 */
export function registerSvelteLanguage(): void {
  monaco.languages.register({
    id: svelteLanguage.id,
    extensions: svelteLanguage.extensions,
    aliases: svelteLanguage.aliases,
    mimetypes: svelteLanguage.mimetypes
  })

  if (svelteLanguage.configuration) {
    monaco.languages.setLanguageConfiguration(
      svelteLanguage.id,
      svelteLanguage.configuration as monaco.languages.LanguageConfiguration
    )
  }

  if (svelteLanguage.monarchTokens) {
    monaco.languages.setMonarchTokensProvider(
      svelteLanguage.id,
      svelteLanguage.monarchTokens as monaco.languages.IMonarchLanguage
    )
  }
}
