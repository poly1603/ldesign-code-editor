import type { EditorTheme } from '../types'

/**
 * GitHub Light theme
 */
export const githubLight: EditorTheme = {
  name: 'github-light',
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'd73a49' },
    { token: 'keyword.control', foreground: 'd73a49' },
    { token: 'keyword.operator', foreground: 'd73a49' },
    { token: 'string', foreground: '032f62' },
    { token: 'string.escape', foreground: '22863a' },
    { token: 'number', foreground: '005cc5' },
    { token: 'type', foreground: '6f42c1' },
    { token: 'type.identifier', foreground: '6f42c1' },
    { token: 'class', foreground: '6f42c1' },
    { token: 'function', foreground: '6f42c1' },
    { token: 'variable', foreground: '24292e' },
    { token: 'variable.predefined', foreground: '005cc5' },
    { token: 'constant', foreground: '005cc5' },
    { token: 'parameter', foreground: 'e36209' },
    { token: 'tag', foreground: '22863a' },
    { token: 'tag.id', foreground: '6f42c1' },
    { token: 'tag.class', foreground: '6f42c1' },
    { token: 'attribute.name', foreground: '6f42c1' },
    { token: 'attribute.value', foreground: '032f62' },
    { token: 'delimiter', foreground: '24292e' },
    { token: 'delimiter.html', foreground: '24292e' },
    { token: 'metatag', foreground: '6f42c1' },
    { token: 'metatag.content.html', foreground: 'd73a49' },
    { token: 'regexp', foreground: '032f62' }
  ],
  colors: {
    'editor.background': '#ffffff',
    'editor.foreground': '#24292e',
    'editor.lineHighlightBackground': '#f6f8fa',
    'editor.selectionBackground': '#0366d625',
    'editorCursor.foreground': '#24292e',
    'editorLineNumber.foreground': '#1b1f234d',
    'editorLineNumber.activeForeground': '#24292e',
    'editorIndentGuide.background': '#eff2f6',
    'editorIndentGuide.activeBackground': '#d7dbe0',
    'editorWhitespace.foreground': '#d1d5da',
    'editorBracketMatch.background': '#34d05833',
    'editorBracketMatch.border': '#34d058'
  }
}

/**
 * GitHub Dark theme
 */
export const githubDark: EditorTheme = {
  name: 'github-dark',
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '8b949e', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'ff7b72' },
    { token: 'keyword.control', foreground: 'ff7b72' },
    { token: 'keyword.operator', foreground: 'ff7b72' },
    { token: 'string', foreground: 'a5d6ff' },
    { token: 'string.escape', foreground: '7ee787' },
    { token: 'number', foreground: '79c0ff' },
    { token: 'type', foreground: 'd2a8ff' },
    { token: 'type.identifier', foreground: 'd2a8ff' },
    { token: 'class', foreground: 'd2a8ff' },
    { token: 'function', foreground: 'd2a8ff' },
    { token: 'variable', foreground: 'c9d1d9' },
    { token: 'variable.predefined', foreground: '79c0ff' },
    { token: 'constant', foreground: '79c0ff' },
    { token: 'parameter', foreground: 'ffa657' },
    { token: 'tag', foreground: '7ee787' },
    { token: 'tag.id', foreground: 'd2a8ff' },
    { token: 'tag.class', foreground: 'd2a8ff' },
    { token: 'attribute.name', foreground: 'd2a8ff' },
    { token: 'attribute.value', foreground: 'a5d6ff' },
    { token: 'delimiter', foreground: 'c9d1d9' },
    { token: 'delimiter.html', foreground: 'c9d1d9' },
    { token: 'metatag', foreground: 'd2a8ff' },
    { token: 'metatag.content.html', foreground: 'ff7b72' },
    { token: 'regexp', foreground: 'a5d6ff' }
  ],
  colors: {
    'editor.background': '#0d1117',
    'editor.foreground': '#c9d1d9',
    'editor.lineHighlightBackground': '#161b22',
    'editor.selectionBackground': '#3fb95040',
    'editorCursor.foreground': '#c9d1d9',
    'editorLineNumber.foreground': '#484f58',
    'editorLineNumber.activeForeground': '#c9d1d9',
    'editorIndentGuide.background': '#21262d',
    'editorIndentGuide.activeBackground': '#30363d',
    'editorWhitespace.foreground': '#484f58',
    'editorBracketMatch.background': '#3fb95033',
    'editorBracketMatch.border': '#3fb950'
  }
}
