import * as monaco from 'monaco-editor'
import type { EditorLanguage, LanguageConfiguration, MonarchLanguage } from '../../types'

/**
 * Vue Single File Component language definition
 */
export const vueLanguage: EditorLanguage = {
  id: 'vue',
  extensions: ['.vue'],
  aliases: ['Vue', 'vue', 'Vue Component'],
  mimetypes: ['text/x-vue', 'text/vue'],
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
      { open: '<!--', close: '-->', notIn: ['comment', 'string'] },
      { open: '<', close: '>', notIn: ['comment', 'string'] }
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '`', close: '`' },
      { open: '<', close: '>' }
    ],
    folding: {
      markers: {
        start: /^\s*<!--\s*#?region\b.*-->/,
        end: /^\s*<!--\s*#?endregion\b.*-->/
      }
    }
  } as LanguageConfiguration,
  monarchTokens: {
    defaultToken: '',
    tokenPostfix: '.vue',
    ignoreCase: false,

    tokenizer: {
      root: [
        // Comments
        [/<!--/, 'comment', '@comment'],
        // Script block
        [/(<)(script)/, ['delimiter.html', { token: 'tag', next: '@script' }]],
        // Style block
        [/(<)(style)/, ['delimiter.html', { token: 'tag', next: '@style' }]],
        // Template block
        [/(<)(template)/, ['delimiter.html', { token: 'tag', next: '@template' }]],
        // Other tags
        [/(<)([\w-]+)/, ['delimiter.html', 'tag']],
        [/(<\/)([\w-]+)(\s*)(>)/, ['delimiter.html', 'tag', '', 'delimiter.html']],
        // Vue directives in attributes
        [/v-[\w-]+/, 'attribute.name'],
        [/@[\w-]+/, 'attribute.name'],
        [/:[\w-]+/, 'attribute.name'],
        [/#[\w-]+/, 'attribute.name'],
        // Attribute
        [/[\w-]+(?==)/, 'attribute.name'],
        [/"[^"]*"/, 'attribute.value'],
        [/'[^']*'/, 'attribute.value'],
        // Mustache
        [/\{\{/, { token: 'delimiter.bracket', next: '@mustache' }],
        // Close tag
        [/>/, 'delimiter.html'],
        [/\/>/, 'delimiter.html'],
        // Text
        [/[^<{]+/, '']
      ],

      comment: [
        [/-->/, 'comment', '@pop'],
        [/[^-]+/, 'comment'],
        [/./, 'comment']
      ],

      mustache: [
        [/\}\}/, { token: 'delimiter.bracket', next: '@pop' }],
        [/[^}]+/, 'variable']
      ],

      script: [
        [/>/, { token: 'delimiter.html', next: '@scriptContent' }],
        [/lang\s*=\s*["']?(ts|typescript)["']?/, 'attribute.value'],
        [/setup/, 'attribute.name'],
        [/[\w-]+(?==)/, 'attribute.name'],
        [/"[^"]*"/, 'attribute.value'],
        [/'[^']*'/, 'attribute.value'],
        [/\s+/, '']
      ],

      scriptContent: [
        [/(<\/)(script)(\s*)(>)/, ['delimiter.html', 'tag', '', { token: 'delimiter.html', next: '@pop' }]],
        // Keywords
        [/\b(import|export|from|const|let|var|function|return|if|else|for|while|class|extends|new|this|typeof|instanceof)\b/, 'keyword'],
        // Types
        [/\b(string|number|boolean|any|void|null|undefined|never|unknown)\b/, 'type'],
        // Strings
        [/"([^"\\]|\\.)*"/, 'string'],
        [/'([^'\\]|\\.)*'/, 'string'],
        [/`/, 'string', '@templateString'],
        // Comments
        [/\/\/.*$/, 'comment'],
        [/\/\*/, 'comment', '@blockComment'],
        // Numbers
        [/\d+(\.\d+)?/, 'number'],
        // Identifiers
        [/[a-zA-Z_]\w*/, 'identifier'],
        // Operators
        [/[{}()\[\]]/, 'delimiter'],
        [/[<>]=?|[!=]=?=?|&&|\|\|/, 'operator'],
        [/[+\-*/%=]/, 'operator'],
        [/[;,.]/, 'delimiter'],
        [/\s+/, '']
      ],

      templateString: [
        [/\$\{/, { token: 'delimiter', next: '@templateExpr' }],
        [/`/, { token: 'string', next: '@pop' }],
        [/./, 'string']
      ],

      templateExpr: [
        [/\}/, { token: 'delimiter', next: '@pop' }],
        [/[^}]+/, 'variable']
      ],

      blockComment: [
        [/\*\//, { token: 'comment', next: '@pop' }],
        [/./, 'comment']
      ],

      style: [
        [/>/, { token: 'delimiter.html', next: '@styleContent' }],
        [/lang\s*=\s*["']?(scss|sass|less)["']?/, 'attribute.value'],
        [/scoped/, 'attribute.name'],
        [/[\w-]+(?==)/, 'attribute.name'],
        [/"[^"]*"/, 'attribute.value'],
        [/'[^']*'/, 'attribute.value'],
        [/\s+/, '']
      ],

      styleContent: [
        [/(<\/)(style)(\s*)(>)/, ['delimiter.html', 'tag', '', { token: 'delimiter.html', next: '@pop' }]],
        // Selectors
        [/[.#][\w-]+/, 'tag'],
        [/[\w-]+(?=\s*\{)/, 'tag'],
        // Properties
        [/[\w-]+(?=\s*:)/, 'attribute.name'],
        // Values
        [/#[0-9a-fA-F]+/, 'number'],
        [/\d+(\.\d+)?(px|em|rem|%|vh|vw)?/, 'number'],
        // Strings
        [/"[^"]*"/, 'string'],
        [/'[^']*'/, 'string'],
        // Comments
        [/\/\*/, 'comment', '@blockComment'],
        // Delimiters
        [/[{}:;,]/, 'delimiter'],
        [/\s+/, '']
      ],

      template: [
        [/>/, { token: 'delimiter.html', next: '@templateContent' }],
        [/[\w-]+(?==)/, 'attribute.name'],
        [/"[^"]*"/, 'attribute.value'],
        [/'[^']*'/, 'attribute.value'],
        [/\s+/, '']
      ],

      templateContent: [
        [/(<\/)(template)(\s*)(>)/, ['delimiter.html', 'tag', '', { token: 'delimiter.html', next: '@pop' }]],
        // Include root rules for template content
        { include: 'root' }
      ]
    }
  } as MonarchLanguage
}

/**
 * Register Vue language with Monaco
 */
export function registerVueLanguage(): void {
  // Register the language
  monaco.languages.register({
    id: vueLanguage.id,
    extensions: vueLanguage.extensions,
    aliases: vueLanguage.aliases,
    mimetypes: vueLanguage.mimetypes
  })

  // Register configuration
  if (vueLanguage.configuration) {
    monaco.languages.setLanguageConfiguration(
      vueLanguage.id,
      vueLanguage.configuration as monaco.languages.LanguageConfiguration
    )
  }

  // Register tokenizer
  if (vueLanguage.monarchTokens) {
    monaco.languages.setMonarchTokensProvider(
      vueLanguage.id,
      vueLanguage.monarchTokens as monaco.languages.IMonarchLanguage
    )
  }
}
