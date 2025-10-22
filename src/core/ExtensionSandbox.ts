/**
 * 扩展沙箱环境
 */

export class ExtensionSandbox {
  private iframe: HTMLIFrameElement | null = null

  createSandbox(): HTMLIFrameElement {
    this.iframe = document.createElement('iframe')
    this.iframe.style.display = 'none'
    this.iframe.sandbox.add('allow-scripts')
    document.body.appendChild(this.iframe)
    return this.iframe
  }

  async executeInSandbox(code: string): Promise<unknown> {
    if (!this.iframe || !this.iframe.contentWindow) {
      throw new Error('Sandbox not initialized')
    }

    return new Promise((resolve, reject) => {
      const handler = (event: MessageEvent) => {
        if (event.source === this.iframe?.contentWindow) {
          window.removeEventListener('message', handler)
          if (event.data.error) {
            reject(new Error(event.data.error))
          } else {
            resolve(event.data.result)
          }
        }
      }

      window.addEventListener('message', handler)

      this.iframe.contentWindow.postMessage({ code }, '*')
    })
  }

  destroy(): void {
    if (this.iframe) {
      this.iframe.remove()
      this.iframe = null
    }
  }
}

