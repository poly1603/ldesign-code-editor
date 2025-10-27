/**
 * 语言注册中心
 */

import { PythonLanguageService } from './python/PythonLanguageService'
import { GoLanguageService } from './go/GoLanguageService'
import { RustLanguageService } from './rust/RustLanguageService'
import { JavaLanguageService } from './java/JavaLanguageService'

export class LanguageRegistry {
  private static instance: LanguageRegistry
  private services = new Map<string, { register: () => void }>()

  private constructor() {
    this.registerServices()
  }

  static getInstance(): LanguageRegistry {
    if (!LanguageRegistry.instance) {
      LanguageRegistry.instance = new LanguageRegistry()
    }
    return LanguageRegistry.instance
  }

  private registerServices(): void {
    this.services.set('python', new PythonLanguageService())
    this.services.set('go', new GoLanguageService())
    this.services.set('rust', new RustLanguageService())
    this.services.set('java', new JavaLanguageService())
  }

  registerLanguage(language: string): void {
    const service = this.services.get(language)
    if (service) {
      service.register()
    }
  }

  registerAllLanguages(): void {
    this.services.forEach((service) => service.register())
  }
}

export const languageRegistry = LanguageRegistry.getInstance()

