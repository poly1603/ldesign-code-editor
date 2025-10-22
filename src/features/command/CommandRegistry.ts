/**
 * 命令注册中心
 */

export interface Command {
  id: string
  title: string
  category?: string
  keybinding?: string
  handler: (...args: unknown[]) => void | Promise<void>
}

export class CommandRegistry {
  private commands = new Map<string, Command>()
  private aliases = new Map<string, string>()
  private history: string[] = []
  private maxHistorySize = 50

  registerCommand(command: Command): void {
    this.commands.set(command.id, command)
  }

  unregisterCommand(id: string): boolean {
    return this.commands.delete(id)
  }

  registerAlias(alias: string, commandId: string): void {
    this.aliases.set(alias, commandId)
  }

  getCommand(idOrAlias: string): Command | undefined {
    const commandId = this.aliases.get(idOrAlias) || idOrAlias
    return this.commands.get(commandId)
  }

  getAllCommands(): Command[] {
    return Array.from(this.commands.values())
  }

  searchCommands(query: string): Command[] {
    const lowerQuery = query.toLowerCase()
    return this.getAllCommands().filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(lowerQuery) ||
        cmd.id.toLowerCase().includes(lowerQuery) ||
        cmd.category?.toLowerCase().includes(lowerQuery)
    )
  }

  async executeCommand(id: string, ...args: unknown[]): Promise<void> {
    const command = this.getCommand(id)
    if (!command) {
      throw new Error(`Command not found: ${id}`)
    }

    this.addToHistory(id)
    await command.handler(...args)
  }

  getHistory(): string[] {
    return [...this.history]
  }

  private addToHistory(id: string): void {
    this.history.unshift(id)
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(0, this.maxHistorySize)
    }
  }

  clearHistory(): void {
    this.history = []
  }
}

export const commandRegistry = new CommandRegistry()

