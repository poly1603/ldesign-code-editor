/**
 * WebSocket 客户端
 * 处理实时通信
 */

import type { CollaborationMessage } from '../../types/collaboration'

export interface WebSocketClientOptions {
  url: string
  reconnectAttempts?: number
  reconnectDelay?: number
  heartbeatInterval?: number
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Error) => void
  onMessage?: (message: CollaborationMessage) => void
}

export class WebSocketClient {
  private ws: WebSocket | null = null
  private options: Required<WebSocketClientOptions>
  private reconnectAttempts = 0
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private isIntentionallyClosed = false
  private messageQueue: CollaborationMessage[] = []

  constructor(options: WebSocketClientOptions) {
    this.options = {
      url: options.url,
      reconnectAttempts: options.reconnectAttempts || 5,
      reconnectDelay: options.reconnectDelay || 3000,
      heartbeatInterval: options.heartbeatInterval || 30000,
      onOpen: options.onOpen || (() => { }),
      onClose: options.onClose || (() => { }),
      onError: options.onError || (() => { }),
      onMessage: options.onMessage || (() => { }),
    }
  }

  /**
   * 连接到服务器
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.options.url)

        this.ws.onopen = () => {
          console.log('WebSocket connected')
          this.reconnectAttempts = 0
          this.startHeartbeat()
          this.flushMessageQueue()
          this.options.onOpen()
          resolve()
        }

        this.ws.onclose = (event) => {
          console.log('WebSocket closed', event.code, event.reason)
          this.stopHeartbeat()
          this.options.onClose()

          if (!this.isIntentionallyClosed) {
            this.attemptReconnect()
          }
        }

        this.ws.onerror = (event) => {
          console.error('WebSocket error:', event)
          const error = new Error('WebSocket connection error')
          this.options.onError(error)
          reject(error)
        }

        this.ws.onmessage = (event) => {
          try {
            const message: CollaborationMessage = JSON.parse(event.data)
            this.options.onMessage(message)
          } catch (error) {
            console.error('Failed to parse message:', error)
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * 发送消息
   */
  send(message: CollaborationMessage): void {
    if (this.isConnected()) {
      this.ws!.send(JSON.stringify(message))
    } else {
      // 排队等待重连
      this.messageQueue.push(message)
    }
  }

  /**
   * 检查连接状态
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }

  /**
   * 关闭连接
   */
  close(): void {
    this.isIntentionallyClosed = true
    this.stopHeartbeat()

    if (this.ws) {
      this.ws.close(1000, 'Client closed connection')
      this.ws = null
    }
  }

  /**
   * 尝试重连
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.options.reconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`)

    setTimeout(() => {
      this.connect().catch((error) => {
        console.error('Reconnection failed:', error)
      })
    }, this.options.reconnectDelay * this.reconnectAttempts)
  }

  /**
   * 开始心跳
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.send({
          type: 'presence',
          senderId: '',
          timestamp: Date.now(),
          data: { type: 'heartbeat' },
        })
      }
    }, this.options.heartbeatInterval)
  }

  /**
   * 停止心跳
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  /**
   * 刷新消息队列
   */
  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()
      if (message) {
        this.send(message)
      }
    }
  }

  /**
   * 获取连接状态
   */
  getReadyState(): number {
    return this.ws?.readyState || WebSocket.CLOSED
  }

  /**
   * 获取队列大小
   */
  getQueueSize(): number {
    return this.messageQueue.length
  }
}

