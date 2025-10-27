/**
 * 文件搜索
 */

import type { FileNode, FileSearchOptions, FileSearchResult } from '../../types/filesystem'

export class FileSearch {
  search(nodes: FileNode[], options: FileSearchOptions): FileSearchResult[] {
    const results: FileSearchResult[] = []
    const regex = options.regex
      ? new RegExp(options.query, options.caseSensitive ? '' : 'i')
      : null

    const searchText = options.caseSensitive ? options.query : options.query.toLowerCase()

    for (const node of nodes) {
      if (node.type === 'file') {
        const nameMatch = this.matchFileName(node.name, searchText, regex, options.caseSensitive)

        if (nameMatch || options.includeContent) {
          const contentMatches = options.includeContent && node.content
            ? this.searchInContent(node.content, searchText, regex)
            : []

          if (nameMatch || contentMatches.length > 0) {
            results.push({
              file: node,
              matches: contentMatches,
            })
          }
        }
      } else if (node.children) {
        results.push(...this.search(node.children, options))
      }

      if (results.length >= (options.maxResults || 100)) {
        break
      }
    }

    return results
  }

  private matchFileName(
    name: string,
    query: string,
    regex: RegExp | null,
    caseSensitive?: boolean
  ): boolean {
    if (regex) {
      return regex.test(name)
    }
    const testName = caseSensitive ? name : name.toLowerCase()
    return testName.includes(query)
  }

  private searchInContent(
    content: string,
    query: string,
    regex: RegExp | null
  ): Array<{ line: number; column: number; text: string }> {
    const matches: Array<{ line: number; column: number; text: string }> = []
    const lines = content.split('\n')

    lines.forEach((line, index) => {
      if (regex) {
        const match = line.match(regex)
        if (match && match.index !== undefined) {
          matches.push({ line: index + 1, column: match.index, text: line })
        }
      } else {
        const idx = line.indexOf(query)
        if (idx !== -1) {
          matches.push({ line: index + 1, column: idx, text: line })
        }
      }
    })

    return matches
  }
}

