import type * as monaco from 'monaco-editor'

/**
 * Code editor configuration options
 */
export interface CodeEditorOptions {
  /** Container element or selector */
  container: HTMLElement | string
  /** Initial code value */
  value?: string
  /** Programming language */
  language?: string
  /** Editor theme */
  theme?: string
  /** Read-only mode */
  readOnly?: boolean
  /** Show line numbers */
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval'
  /** Show minimap */
  minimap?: boolean | monaco.editor.IEditorMinimapOptions
  /** Word wrap mode */
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded'
  /** Font size in pixels */
  fontSize?: number
  /** Font family */
  fontFamily?: string
  /** Tab size */
  tabSize?: number
  /** Auto format on paste */
  formatOnPaste?: boolean
  /** Auto format on type */
  formatOnType?: boolean
  /** Show folding controls */
  folding?: boolean
  /** Enable auto closing brackets */
  autoClosingBrackets?: 'always' | 'languageDefined' | 'beforeWhitespace' | 'never'
  /** Enable auto indentation */
  autoIndent?: 'none' | 'keep' | 'brackets' | 'advanced' | 'full'
  /** Scroll beyond last line */
  scrollBeyondLastLine?: boolean
  /** Render whitespace */
  renderWhitespace?: 'none' | 'boundary' | 'selection' | 'trailing' | 'all'
  /** Cursor style */
  cursorStyle?: 'line' | 'block' | 'underline' | 'line-thin' | 'block-outline' | 'underline-thin'
  /** Cursor blinking style */
  cursorBlinking?: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid'
  /** Enable suggestions */
  suggestOnTriggerCharacters?: boolean
  /** Quick suggestions */
  quickSuggestions?: boolean | { other?: boolean; comments?: boolean; strings?: boolean }
  /** Placeholder text when empty */
  placeholder?: string
  /** Additional Monaco editor options */
  editorOptions?: monaco.editor.IStandaloneEditorConstructionOptions
}

/**
 * Code editor instance interface
 */
export interface CodeEditorInstance {
  /** Get Monaco editor instance */
  getMonacoEditor(): monaco.editor.IStandaloneCodeEditor
  /** Get current value */
  getValue(): string
  /** Set value */
  setValue(value: string): void
  /** Get selected text */
  getSelection(): string
  /** Set selection range */
  setSelection(startLine: number, startColumn: number, endLine: number, endColumn: number): void
  /** Get current language */
  getLanguage(): string
  /** Set language */
  setLanguage(language: string): void
  /** Get current theme */
  getTheme(): string
  /** Set theme */
  setTheme(theme: string): void
  /** Focus the editor */
  focus(): void
  /** Blur the editor */
  blur(): void
  /** Format document */
  format(): Promise<void>
  /** Undo last action */
  undo(): void
  /** Redo last action */
  redo(): void
  /** Insert text at cursor position */
  insertText(text: string): void
  /** Get cursor position */
  getPosition(): monaco.Position | null
  /** Set cursor position */
  setPosition(line: number, column: number): void
  /** Scroll to line */
  scrollToLine(line: number): void
  /** Add event listener */
  on<K extends keyof EditorEventMap>(event: K, handler: EditorEventMap[K]): void
  /** Remove event listener */
  off<K extends keyof EditorEventMap>(event: K, handler: EditorEventMap[K]): void
  /** Update editor options */
  updateOptions(options: Partial<CodeEditorOptions>): void
  /** Layout the editor */
  layout(): void
  /** Dispose the editor */
  dispose(): void
  /** Check if disposed */
  isDisposed(): boolean
  /** Add action to editor */
  addAction(action: monaco.editor.IActionDescriptor): monaco.IDisposable
  /** Add command to editor */
  addCommand(keybinding: number, handler: () => void): string | null
  /** Get model markers (errors, warnings) */
  getMarkers(): monaco.editor.IMarker[]
  /** Set model markers */
  setMarkers(markers: monaco.editor.IMarkerData[]): void
  /** Clear markers */
  clearMarkers(): void
  /** Register completion provider */
  registerCompletionProvider(provider: CompletionProvider): monaco.IDisposable
  /** Register hover provider */
  registerHoverProvider(provider: HoverProvider): monaco.IDisposable
  /** Register format provider */
  registerFormatProvider(provider: FormatProvider): monaco.IDisposable
}

/**
 * Editor event types
 */
export interface EditorEventMap {
  change: (value: string, event: monaco.editor.IModelContentChangedEvent) => void
  blur: () => void
  focus: () => void
  cursorChange: (position: monaco.Position) => void
  selectionChange: (selection: monaco.Selection) => void
  scroll: (event: monaco.IScrollEvent) => void
  keydown: (event: monaco.IKeyboardEvent) => void
  contextMenu: (event: monaco.editor.IEditorMouseEvent) => void
  save: (value: string) => void
}

export type EditorEvent = keyof EditorEventMap
export type EditorEventHandler<K extends EditorEvent = EditorEvent> = EditorEventMap[K]

/**
 * Theme definition
 */
export interface EditorTheme {
  name: string
  base: 'vs' | 'vs-dark' | 'hc-black' | 'hc-light'
  inherit: boolean
  rules: TokenRule[]
  colors: Record<string, string>
}

/**
 * Token rule for theme
 */
export interface TokenRule {
  token: string
  foreground?: string
  background?: string
  fontStyle?: string
}

/**
 * Language definition
 */
export interface EditorLanguage {
  id: string
  extensions?: string[]
  aliases?: string[]
  mimetypes?: string[]
  configuration?: LanguageConfiguration
  monarchTokens?: MonarchLanguage
}

/**
 * Language configuration
 */
export interface LanguageConfiguration {
  comments?: {
    lineComment?: string
    blockComment?: [string, string]
  }
  brackets?: [string, string][]
  autoClosingPairs?: Array<{
    open: string
    close: string
    notIn?: string[]
  }>
  surroundingPairs?: Array<{
    open: string
    close: string
  }>
  folding?: {
    markers?: {
      start?: RegExp
      end?: RegExp
    }
    offSide?: boolean
  }
  wordPattern?: RegExp
  indentationRules?: {
    increaseIndentPattern?: RegExp
    decreaseIndentPattern?: RegExp
  }
}

/**
 * Monarch language definition
 */
export interface MonarchLanguage {
  defaultToken?: string
  tokenPostfix?: string
  ignoreCase?: boolean
  brackets?: Array<{
    open: string
    close: string
    token: string
  }>
  keywords?: string[]
  typeKeywords?: string[]
  operators?: string[]
  symbols?: RegExp
  escapes?: RegExp
  tokenizer: Record<string, Array<unknown>>
  [key: string]: unknown
}

/**
 * Diff editor options
 */
export interface DiffEditorOptions {
  container: HTMLElement | string
  original: string
  modified: string
  language?: string
  theme?: string
  readOnly?: boolean
  renderSideBySide?: boolean
  enableSplitViewResizing?: boolean
  originalEditable?: boolean
  editorOptions?: monaco.editor.IDiffEditorConstructionOptions
}

/**
 * Completion provider interface
 */
export interface CompletionProvider {
  triggerCharacters?: string[]
  provideCompletionItems(
    model: monaco.editor.ITextModel,
    position: monaco.Position,
    context: monaco.languages.CompletionContext,
    token: monaco.CancellationToken
  ): monaco.languages.ProviderResult<monaco.languages.CompletionList>
}

/**
 * Hover provider interface
 */
export interface HoverProvider {
  provideHover(
    model: monaco.editor.ITextModel,
    position: monaco.Position,
    token: monaco.CancellationToken
  ): monaco.languages.ProviderResult<monaco.languages.Hover>
}

/**
 * Format provider interface
 */
export interface FormatProvider {
  provideDocumentFormattingEdits(
    model: monaco.editor.ITextModel,
    options: monaco.languages.FormattingOptions,
    token: monaco.CancellationToken
  ): monaco.languages.ProviderResult<monaco.languages.TextEdit[]>
}
