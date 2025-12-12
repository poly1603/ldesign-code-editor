// Core exports
export { CodeEditor } from './core'
export {
  createEditor,
  destroyEditor,
  getEditorByContainer,
  getAllEditors,
  destroyAllEditors
} from './core'

// Theme exports
export {
  defaultThemes,
  registerTheme,
  getTheme,
  getAvailableThemes,
  hasTheme,
  // Individual themes
  githubLight,
  githubDark,
  oneDark,
  dracula,
  nord,
  monokai
} from './themes'

// Language exports
export {
  defaultLanguages,
  registerLanguage,
  getLanguage,
  getAvailableLanguages,
  hasLanguage,
  detectLanguage,
  getLanguageConfiguration,
  // Individual languages
  vueLanguage,
  svelteLanguage,
  prismaLanguage,
  graphqlLanguage,
  tomlLanguage,
  dotenvLanguage
} from './languages'

// Types
export type {
  CodeEditorOptions,
  CodeEditorInstance,
  EditorTheme,
  EditorLanguage,
  EditorEvent,
  EditorEventHandler,
  EditorEventMap,
  DiffEditorOptions,
  CompletionProvider,
  HoverProvider,
  FormatProvider,
  LanguageConfiguration,
  MonarchLanguage,
  TokenRule
} from './types'
