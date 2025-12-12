import type { EditorTheme } from '../types'

/**
 * Nord theme
 */
export const nord: EditorTheme = {
  name: 'nord',
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '616e88', fontStyle: 'italic' },
    { token: 'keyword', foreground: '81a1c1' },
    { token: 'keyword.control', foreground: '81a1c1' },
    { token: 'keyword.operator', foreground: '81a1c1' },
    { token: 'string', foreground: 'a3be8c' },
    { token: 'string.escape', foreground: 'ebcb8b' },
    { token: 'number', foreground: 'b48ead' },
    { token: 'type', foreground: '8fbcbb' },
    { token: 'type.identifier', foreground: '8fbcbb' },
    { token: 'class', foreground: '8fbcbb' },
    { token: 'function', foreground: '88c0d0' },
    { token: 'variable', foreground: 'd8dee9' },
    { token: 'variable.predefined', foreground: '5e81ac' },
    { token: 'constant', foreground: 'b48ead' },
    { token: 'parameter', foreground: 'd8dee9' },
    { token: 'tag', foreground: '81a1c1' },
    { token: 'tag.id', foreground: '8fbcbb' },
    { token: 'tag.class', foreground: '8fbcbb' },
    { token: 'attribute.name', foreground: '8fbcbb' },
    { token: 'attribute.value', foreground: 'a3be8c' },
    { token: 'delimiter', foreground: 'eceff4' },
    { token: 'delimiter.html', foreground: '81a1c1' },
    { token: 'metatag', foreground: '5e81ac' },
    { token: 'metatag.content.html', foreground: 'd8dee9' },
    { token: 'regexp', foreground: 'ebcb8b' }
  ],
  colors: {
    'editor.background': '#2e3440',
    'editor.foreground': '#d8dee9',
    'editor.lineHighlightBackground': '#3b4252',
    'editor.selectionBackground': '#434c5e',
    'editorCursor.foreground': '#d8dee9',
    'editorLineNumber.foreground': '#4c566a',
    'editorLineNumber.activeForeground': '#d8dee9',
    'editorIndentGuide.background': '#434c5e',
    'editorIndentGuide.activeBackground': '#4c566a',
    'editorWhitespace.foreground': '#434c5e',
    'editorBracketMatch.background': '#434c5e',
    'editorBracketMatch.border': '#88c0d0'
  }
}
