import type { EditorTheme } from '../types'

/**
 * Dracula theme
 */
export const dracula: EditorTheme = {
  name: 'dracula',
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'ff79c6' },
    { token: 'keyword.control', foreground: 'ff79c6' },
    { token: 'keyword.operator', foreground: 'ff79c6' },
    { token: 'string', foreground: 'f1fa8c' },
    { token: 'string.escape', foreground: 'ff79c6' },
    { token: 'number', foreground: 'bd93f9' },
    { token: 'type', foreground: '8be9fd', fontStyle: 'italic' },
    { token: 'type.identifier', foreground: '8be9fd' },
    { token: 'class', foreground: '8be9fd' },
    { token: 'function', foreground: '50fa7b' },
    { token: 'variable', foreground: 'f8f8f2' },
    { token: 'variable.predefined', foreground: 'bd93f9' },
    { token: 'constant', foreground: 'bd93f9' },
    { token: 'parameter', foreground: 'ffb86c', fontStyle: 'italic' },
    { token: 'tag', foreground: 'ff79c6' },
    { token: 'tag.id', foreground: '50fa7b' },
    { token: 'tag.class', foreground: '50fa7b' },
    { token: 'attribute.name', foreground: '50fa7b' },
    { token: 'attribute.value', foreground: 'f1fa8c' },
    { token: 'delimiter', foreground: 'f8f8f2' },
    { token: 'delimiter.html', foreground: 'f8f8f2' },
    { token: 'metatag', foreground: 'ff79c6' },
    { token: 'metatag.content.html', foreground: 'f1fa8c' },
    { token: 'regexp', foreground: 'f1fa8c' }
  ],
  colors: {
    'editor.background': '#282a36',
    'editor.foreground': '#f8f8f2',
    'editor.lineHighlightBackground': '#44475a',
    'editor.selectionBackground': '#44475a',
    'editorCursor.foreground': '#f8f8f0',
    'editorLineNumber.foreground': '#6272a4',
    'editorLineNumber.activeForeground': '#f8f8f2',
    'editorIndentGuide.background': '#424450',
    'editorIndentGuide.activeBackground': '#6272a4',
    'editorWhitespace.foreground': '#424450',
    'editorBracketMatch.background': '#44475a',
    'editorBracketMatch.border': '#50fa7b'
  }
}
