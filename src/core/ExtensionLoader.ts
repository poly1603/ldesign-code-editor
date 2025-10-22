/**
 * 扩展加载器
 */

import type { Extension, ExtensionContext, ExtensionManifest } from '../types/extension'

export class ExtensionLoader {
  private extensions = new Map<string, Extension>()
  private activeExtensions = new Set<string>()

  async loadExtension(manifest: ExtensionManifest): Promise<Extension> {
    const extension: Extension = {
      id: `${manifest.name}@${manifest.version}`,
      name: manifest.name,
      version: manifest.version,
      main: manifest.main || manifest.browser || '',
      contributes: manifest.contributes,
    }

    this.extensions.set(extension.id, extension)
    return extension
  }

  async activateExtension(extensionId: string): Promise<void> {
    const extension = this.extensions.get(extensionId)
    if (!extension) {
      throw new Error(`Extension not found: ${extensionId}`)
    }

    if (this.activeExtensions.has(extensionId)) {
      return
    }

    const context = this.createContext(extension)

    // 动态加载扩展代码
    if (extension.main) {
      // 这里应该实际加载扩展的JS文件
      console.log(`Activating extension: ${extensionId}`)
    }

    this.activeExtensions.add(extensionId)
  }

  deactivateExtension(extensionId: string): void {
    this.activeExtensions.delete(extensionId)
  }

  getExtensions(): Extension[] {
    return Array.from(this.extensions.values())
  }

  getActiveExtensions(): Extension[] {
    return this.getExtensions().filter((e) => this.activeExtensions.has(e.id))
  }

  private createContext(extension: Extension): ExtensionContext {
    return {
      subscriptions: [],
      extensionPath: `/extensions/${extension.id}`,
      globalState: new Map(),
      workspaceState: new Map(),
    }
  }
}

export const extensionLoader = new ExtensionLoader()

