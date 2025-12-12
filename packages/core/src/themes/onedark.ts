import type { EditorTheme } from '../types'

/**
 * One Dark theme (Atom One Dark)
 */
export const oneDark: EditorTheme = {
  name: 'one-dark',
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'c678dd' },
    { token: 'keyword.control', foreground: 'c678dd' },
    { token: 'keyword.operator', foreground: '56b6c2' },
    { token: 'string', foreground: '98c379' },
    { token: 'string.escape', foreground: '56b6c2' },
    { token: 'number', foreground: 'd19a66' },
    { token: 'type', foreground: 'e5c07b' },
    { token: 'type.identifier', foreground: 'e5c07b' },
    { token: 'class', foreground: 'e5c07b' },
    { token: 'function', foreground: '61afef' },
    { token: 'variable', foreground: 'e06c75' },
    { token: 'variable.predefined', foreground: 'e5c07b' },
    { token: 'constant', foreground: 'd19a66' },
    { token: 'parameter', foreground: 'e06c75' },
    { token: 'tag', foreground: 'e06c75' },
    { token: 'tag.id', foreground: '61afef' },
    { token: 'tag.class', foreground: 'e5c07b' },
    { token: 'attribute.name', foreground: 'd19a66' },
    { token: 'attribute.value', foreground: '98c379' },
    { token: 'delimiter', foreground: 'abb2bf' },
    { token: 'delimiter.html', foreground: 'abb2bf' },
    { token: 'metatag', foreground: 'e06c75' },
    { token: 'metatag.content.html', foreground: 'c678dd' },
    { token: 'regexp', foreground: '56b6c2' }
  ],
  colors: {
    'editor.background': '#282c34',
    'editor.foreground': '#abb2bf',
    'editor.lineHighlightBackground': '#2c313a',
    'editor.selectionBackground': '#3e4451',
    'editorCursor.foreground': '#528bff',
    'editorLineNumber.foreground': '#495162',
    'editorLineNumber.activeForeground': '#abb2bf',
    'editorIndentGuide.background': '#3b4048',
    'editorIndentGuide.activeBackground': '#4b5263',
    'editorWhitespace.foreground': '#3b4048',
    'editorBracketMatch.background': '#515a6b',
    'editorBracketMatch.border': '#515a6b'
  }
}
