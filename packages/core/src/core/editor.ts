import * as monaco from 'monaco-editor'
import type {
  CodeEditorOptions,
  CodeEditorInstance,
  EditorEventMap,
  EditorEvent,
  CompletionProvider,
  HoverProvider,
  FormatProvider
} from '../types'

const MARKER_OWNER = 'code-editor-core'

/**
 * CodeEditor class - Main editor implementation
 */
export class CodeEditor implements CodeEditorInstance {
  private editor: monaco.editor.IStandaloneCodeEditor
  private container: HTMLElement
  private eventListeners: Map<EditorEvent, Set<EditorEventMap[EditorEvent]>> = new Map()
  private disposables: monaco.IDisposable[] = []
  private _isDisposed = false
  private currentLanguage: string
  private currentTheme: string

  constructor(options: CodeEditorOptions) {
    // Resolve container
    this.container = typeof options.container === 'string'
      ? document.querySelector(options.container) as HTMLElement
      : options.container

    if (!this.container) {
      throw new Error('Invalid container element')
    }

    this.currentLanguage = options.language || 'plaintext'
    this.currentTheme = options.theme || 'vs'

    // Build Monaco options
    const editorOptions = this.buildEditorOptions(options)

    // Create editor
    this.editor = monaco.editor.create(this.container, editorOptions)

    // Setup event bindings
    this.setupEventBindings()

    // Handle placeholder
    if (options.placeholder) {
      this.setupPlaceholder(options.placeholder)
    }

    // Register save command (Ctrl+S / Cmd+S)
    this.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      this.emit('save', this.getValue())
    })
  }

  private buildEditorOptions(options: CodeEditorOptions): monaco.editor.IStandaloneEditorConstructionOptions {
    const minimapOptions = typeof options.minimap === 'boolean'
      ? { enabled: options.minimap }
      : options.minimap

    return {
      value: options.value || '',
      language: options.language || 'plaintext',
      theme: options.theme || 'vs',
      readOnly: options.readOnly || false,
      lineNumbers: options.lineNumbers || 'on',
      minimap: minimapOptions || { enabled: true },
      wordWrap: options.wordWrap || 'off',
      fontSize: options.fontSize || 14,
      fontFamily: options.fontFamily || "'Fira Code', Consolas, 'Courier New', monospace",
      tabSize: options.tabSize || 2,
      formatOnPaste: options.formatOnPaste || false,
      formatOnType: options.formatOnType || false,
      folding: options.folding !== false,
      autoClosingBrackets: options.autoClosingBrackets || 'languageDefined',
      autoIndent: options.autoIndent || 'full',
      scrollBeyondLastLine: options.scrollBeyondLastLine !== false,
      renderWhitespace: options.renderWhitespace || 'selection',
      cursorStyle: options.cursorStyle || 'line',
      cursorBlinking: options.cursorBlinking || 'blink',
      suggestOnTriggerCharacters: options.suggestOnTriggerCharacters !== false,
      quickSuggestions: options.quickSuggestions !== false,
      automaticLayout: true,
      scrollbar: {
        useShadows: false,
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10
      },
      ...options.editorOptions
    }
  }

  private setupEventBindings(): void {
    // Content change
    const contentDisposable = this.editor.onDidChangeModelContent((event) => {
      this.emit('change', this.getValue(), event)
    })
    this.disposables.push(contentDisposable)

    // Focus / Blur
    const focusDisposable = this.editor.onDidFocusEditorText(() => {
      this.emit('focus')
    })
    this.disposables.push(focusDisposable)

    const blurDisposable = this.editor.onDidBlurEditorText(() => {
      this.emit('blur')
    })
    this.disposables.push(blurDisposable)

    // Cursor position change
    const cursorDisposable = this.editor.onDidChangeCursorPosition((e) => {
      this.emit('cursorChange', e.position)
    })
    this.disposables.push(cursorDisposable)

    // Selection change
    const selectionDisposable = this.editor.onDidChangeCursorSelection((e) => {
      this.emit('selectionChange', e.selection)
    })
    this.disposables.push(selectionDisposable)

    // Scroll
    const scrollDisposable = this.editor.onDidScrollChange((e) => {
      this.emit('scroll', e)
    })
    this.disposables.push(scrollDisposable)

    // Keydown
    const keydownDisposable = this.editor.onKeyDown((e) => {
      this.emit('keydown', e)
    })
    this.disposables.push(keydownDisposable)

    // Context menu
    const contextMenuDisposable = this.editor.onContextMenu((e) => {
      this.emit('contextMenu', e)
    })
    this.disposables.push(contextMenuDisposable)
  }

  private setupPlaceholder(placeholder: string): void {
    const placeholderElement = document.createElement('div')
    placeholderElement.className = 'code-editor-placeholder'
    placeholderElement.textContent = placeholder
    placeholderElement.style.cssText = `
      position: absolute;
      top: 0;
      left: 60px;
      color: #999;
      pointer-events: none;
      font-family: inherit;
      font-size: inherit;
      line-height: 19px;
      padding: 0 4px;
    `

    const updatePlaceholder = () => {
      const isEmpty = this.getValue().length === 0
      placeholderElement.style.display = isEmpty ? 'block' : 'none'
    }

    this.container.style.position = 'relative'
    this.container.appendChild(placeholderElement)
    updatePlaceholder()

    this.on('change', updatePlaceholder)
  }

  private emit<K extends EditorEvent>(event: K, ...args: Parameters<EditorEventMap[K]>): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach((handler) => {
        (handler as (...args: Parameters<EditorEventMap[K]>) => void)(...args)
      })
    }
  }

  // Public API

  getMonacoEditor(): monaco.editor.IStandaloneCodeEditor {
    return this.editor
  }

  getValue(): string {
    return this.editor.getValue()
  }

  setValue(value: string): void {
    this.editor.setValue(value)
  }

  getSelection(): string {
    const selection = this.editor.getSelection()
    if (!selection) return ''
    return this.editor.getModel()?.getValueInRange(selection) || ''
  }

  setSelection(startLine: number, startColumn: number, endLine: number, endColumn: number): void {
    this.editor.setSelection({
      startLineNumber: startLine,
      startColumn,
      endLineNumber: endLine,
      endColumn
    })
  }

  getLanguage(): string {
    return this.currentLanguage
  }

  setLanguage(language: string): void {
    const model = this.editor.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, language)
      this.currentLanguage = language
    }
  }

  getTheme(): string {
    return this.currentTheme
  }

  setTheme(theme: string): void {
    monaco.editor.setTheme(theme)
    this.currentTheme = theme
  }

  focus(): void {
    this.editor.focus()
  }

  blur(): void {
    const activeElement = document.activeElement as HTMLElement
    if (activeElement && this.container.contains(activeElement)) {
      activeElement.blur()
    }
  }

  async format(): Promise<void> {
    await this.editor.getAction('editor.action.formatDocument')?.run()
  }

  undo(): void {
    this.editor.trigger('keyboard', 'undo', null)
  }

  redo(): void {
    this.editor.trigger('keyboard', 'redo', null)
  }

  insertText(text: string): void {
    const selection = this.editor.getSelection()
    if (selection) {
      this.editor.executeEdits('insert', [{
        range: selection,
        text,
        forceMoveMarkers: true
      }])
    }
  }

  getPosition(): monaco.Position | null {
    return this.editor.getPosition()
  }

  setPosition(line: number, column: number): void {
    this.editor.setPosition({ lineNumber: line, column })
  }

  scrollToLine(line: number): void {
    this.editor.revealLineInCenter(line)
  }

  on<K extends keyof EditorEventMap>(event: K, handler: EditorEventMap[K]): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event)!.add(handler as EditorEventMap[EditorEvent])
  }

  off<K extends keyof EditorEventMap>(event: K, handler: EditorEventMap[K]): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.delete(handler as EditorEventMap[EditorEvent])
    }
  }

  updateOptions(options: Partial<CodeEditorOptions>): void {
    const monacoOptions: monaco.editor.IEditorOptions = {}

    if (options.readOnly !== undefined) monacoOptions.readOnly = options.readOnly
    if (options.lineNumbers !== undefined) monacoOptions.lineNumbers = options.lineNumbers
    if (options.wordWrap !== undefined) monacoOptions.wordWrap = options.wordWrap
    if (options.fontSize !== undefined) monacoOptions.fontSize = options.fontSize
    if (options.fontFamily !== undefined) monacoOptions.fontFamily = options.fontFamily
    if (options.tabSize !== undefined) (monacoOptions as Record<string, unknown>).tabSize = options.tabSize
    if (options.minimap !== undefined) {
      monacoOptions.minimap = typeof options.minimap === 'boolean'
        ? { enabled: options.minimap }
        : options.minimap
    }
    if (options.folding !== undefined) monacoOptions.folding = options.folding
    if (options.renderWhitespace !== undefined) monacoOptions.renderWhitespace = options.renderWhitespace
    if (options.cursorStyle !== undefined) monacoOptions.cursorStyle = options.cursorStyle
    if (options.cursorBlinking !== undefined) monacoOptions.cursorBlinking = options.cursorBlinking

    this.editor.updateOptions(monacoOptions)

    if (options.language !== undefined) this.setLanguage(options.language)
    if (options.theme !== undefined) this.setTheme(options.theme)
    if (options.value !== undefined) this.setValue(options.value)
  }

  layout(): void {
    this.editor.layout()
  }

  dispose(): void {
    if (this._isDisposed) return

    this.disposables.forEach(d => d.dispose())
    this.disposables = []
    this.eventListeners.clear()
    this.editor.dispose()
    this._isDisposed = true
  }

  isDisposed(): boolean {
    return this._isDisposed
  }

  addAction(action: monaco.editor.IActionDescriptor): monaco.IDisposable {
    return this.editor.addAction(action)
  }

  addCommand(keybinding: number, handler: () => void): string | null {
    return this.editor.addCommand(keybinding, handler)
  }

  getMarkers(): monaco.editor.IMarker[] {
    const model = this.editor.getModel()
    if (!model) return []
    return monaco.editor.getModelMarkers({ resource: model.uri })
  }

  setMarkers(markers: monaco.editor.IMarkerData[]): void {
    const model = this.editor.getModel()
    if (model) {
      monaco.editor.setModelMarkers(model, MARKER_OWNER, markers)
    }
  }

  clearMarkers(): void {
    const model = this.editor.getModel()
    if (model) {
      monaco.editor.setModelMarkers(model, MARKER_OWNER, [])
    }
  }

  registerCompletionProvider(provider: CompletionProvider): monaco.IDisposable {
    return monaco.languages.registerCompletionItemProvider(this.currentLanguage, {
      triggerCharacters: provider.triggerCharacters,
      provideCompletionItems: provider.provideCompletionItems
    })
  }

  registerHoverProvider(provider: HoverProvider): monaco.IDisposable {
    return monaco.languages.registerHoverProvider(this.currentLanguage, {
      provideHover: provider.provideHover
    })
  }

  registerFormatProvider(provider: FormatProvider): monaco.IDisposable {
    return monaco.languages.registerDocumentFormattingEditProvider(this.currentLanguage, {
      provideDocumentFormattingEdits: provider.provideDocumentFormattingEdits
    })
  }
}
