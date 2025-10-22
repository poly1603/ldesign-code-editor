/**
 * 命令面板
 */

import { CommandRegistry } from './CommandRegistry'
import type { Command } from './CommandRegistry'

export interface CommandPaletteOptions {
  maxResults?: number
  fuzzySearch?: boolean
  showKeybindings?: boolean
  showCategories?: boolean
}

export class CommandPalette {
  private registry: CommandRegistry
  private options: Required<CommandPaletteOptions>
  private isOpen = false
  private selectedIndex = 0

  constructor(registry: CommandRegistry, options: CommandPaletteOptions = {}) {
    this.registry = registry
    this.options = {
      maxResults: options.maxResults || 20,
      fuzzySearch: options.fuzzySearch !== false,
      showKeybindings: options.showKeybindings !== false,
      showCategories: options.showCategories !== false,
    }
  }

  open(): void {
    this.isOpen = true
    this.selectedIndex = 0
  }

  close(): void {
    this.isOpen = false
  }

  search(query: string): Command[] {
    if (this.options.fuzzySearch) {
      return this.fuzzySearch(query)
    }
    return this.registry.searchCommands(query).slice(0, this.options.maxResults)
  }

  private fuzzySearch(query: string): Command[] {
    const allCommands = this.registry.getAllCommands()
    const scored = allCommands.map((cmd) => ({
      command: cmd,
      score: this.calculateFuzzyScore(query, cmd.title),
    }))

    return scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, this.options.maxResults)
      .map((item) => item.command)
  }

  private calculateFuzzyScore(query: string, text: string): number {
    const lowerQuery = query.toLowerCase()
    const lowerText = text.toLowerCase()

    if (lowerText === lowerQuery) return 100
    if (lowerText.startsWith(lowerQuery)) return 90
    if (lowerText.includes(lowerQuery)) return 70

    let score = 0
    let textIndex = 0

    for (const char of lowerQuery) {
      textIndex = lowerText.indexOf(char, textIndex)
      if (textIndex === -1) return 0
      score += 50 / (textIndex + 1)
      textIndex++
    }

    return Math.min(score, 100)
  }

  selectNext(): void {
    this.selectedIndex++
  }

  selectPrevious(): void {
    this.selectedIndex = Math.max(0, this.selectedIndex - 1)
  }

  async executeSelected(commands: Command[]): Promise<void> {
    if (this.selectedIndex < commands.length) {
      await this.registry.executeCommand(commands[this.selectedIndex].id)
      this.close()
    }
  }
}

