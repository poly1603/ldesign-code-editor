/**
 * 代码片段库
 */

export interface Snippet {
  id: string
  name: string
  prefix: string
  body: string | string[]
  description?: string
  language?: string
  tags?: string[]
  author?: string
  created?: number
}

export interface SnippetCategory {
  id: string
  name: string
  snippets: Snippet[]
}

export class SnippetLibrary {
  private snippets = new Map<string, Snippet>()
  private categories = new Map<string, SnippetCategory>()

  addSnippet(snippet: Snippet): void {
    this.snippets.set(snippet.id, snippet)
  }

  removeSnippet(id: string): boolean {
    return this.snippets.delete(id)
  }

  getSnippet(id: string): Snippet | undefined {
    return this.snippets.get(id)
  }

  getSnippetsByLanguage(language: string): Snippet[] {
    return Array.from(this.snippets.values()).filter(
      (s) => !s.language || s.language === language
    )
  }

  getSnippetsByTag(tag: string): Snippet[] {
    return Array.from(this.snippets.values()).filter(
      (s) => s.tags && s.tags.includes(tag)
    )
  }

  searchSnippets(query: string): Snippet[] {
    const lowerQuery = query.toLowerCase()
    return Array.from(this.snippets.values()).filter(
      (s) =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.prefix.toLowerCase().includes(lowerQuery) ||
        s.description?.toLowerCase().includes(lowerQuery)
    )
  }

  exportSnippets(): string {
    const data = Array.from(this.snippets.values())
    return JSON.stringify(data, null, 2)
  }

  importSnippets(json: string): number {
    try {
      const snippets = JSON.parse(json) as Snippet[]
      snippets.forEach((s) => this.addSnippet(s))
      return snippets.length
    } catch {
      return 0
    }
  }

  addCategory(category: SnippetCategory): void {
    this.categories.set(category.id, category)
  }

  getCategories(): SnippetCategory[] {
    return Array.from(this.categories.values())
  }

  clear(): void {
    this.snippets.clear()
    this.categories.clear()
  }
}

