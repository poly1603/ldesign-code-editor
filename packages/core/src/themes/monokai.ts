import type { EditorTheme } from '../types'

/**
 * Monokai theme
 */
export const monokai: EditorTheme = {
  name: 'monokai',
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '88846f', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'f92672' },
    { token: 'keyword.control', foreground: 'f92672' },
    { token: 'keyword.operator', foreground: 'f92672' },
    { token: 'string', foreground: 'e6db74' },
    { token: 'string.escape', foreground: 'ae81ff' },
    { token: 'number', foreground: 'ae81ff' },
    { token: 'type', foreground: '66d9ef', fontStyle: 'italic' },
    { token: 'type.identifier', foreground: 'a6e22e' },
    { token: 'class', foreground: 'a6e22e' },
    { token: 'function', foreground: 'a6e22e' },
    { token: 'variable', foreground: 'f8f8f2' },
    { token: 'variable.predefined', foreground: 'ae81ff' },
    { token: 'constant', foreground: 'ae81ff' },
    { token: 'parameter', foreground: 'fd971f', fontStyle: 'italic' },
    { token: 'tag', foreground: 'f92672' },
    { token: 'tag.id', foreground: 'a6e22e' },
    { token: 'tag.class', foreground: 'a6e22e' },
    { token: 'attribute.name', foreground: 'a6e22e' },
    { token: 'attribute.value', foreground: 'e6db74' },
    { token: 'delimiter', foreground: 'f8f8f2' },
    { token: 'delimiter.html', foreground: 'f8f8f2' },
    { token: 'metatag', foreground: 'f92672' },
    { token: 'metatag.content.html', foreground: 'e6db74' },
    { token: 'regexp', foreground: 'e6db74' }
  ],
  colors: {
    'editor.background': '#272822',
    'editor.foreground': '#f8f8f2',
    'editor.lineHighlightBackground': '#3e3d32',
    'editor.selectionBackground': '#49483e',
    'editorCursor.foreground': '#f8f8f0',
    'editorLineNumber.foreground': '#90908a',
    'editorLineNumber.activeForeground': '#f8f8f2',
    'editorIndentGuide.background': '#464741',
    'editorIndentGuide.activeBackground': '#767771',
    'editorWhitespace.foreground': '#464741',
    'editorBracketMatch.background': '#3e3d32',
    'editorBracketMatch.border': '#a6e22e'
  }
}
