/**
 * 协同编辑管理器
 */

import { WebSocketClient } from './WebSocketClient'
import { CRDTEngine } from './CRDTEngine'
import { UserPresenceManager } from './UserPresence'
import type {
  CollaborationConfig,
  CollaborationMessage,
  CollaborationEvents,
  EditOperation,
} from '../../types/collaboration'

export class CollaborationManager {
  private wsClient: WebSocketClient
  private crdt: CRDTEngine
  private presence: UserPresenceManager
  private config: CollaborationConfig
  private events: CollaborationEvents

  constructor(config: CollaborationConfig, events: CollaborationEvents = {}) {
    this.config = config
    this.events = events

    this.crdt = new CRDTEngine(config.user.id, '')
    this.presence = new UserPresenceManager(config.user.id)

    this.wsClient = new WebSocketClient({
      url: config.serverUrl,
      onOpen: () => this.handleConnect(),
      onClose: () => this.handleDisconnect(),
      onError: (error) => events.onError?.(error),
      onMessage: (msg) => this.handleMessage(msg),
    })

    if (config.autoConnect !== false) {
      this.connect()
    }
  }

  async connect(): Promise<void> {
    await this.wsClient.connect()
  }

  disconnect(): void {
    this.wsClient.close()
  }

  sendEdit(operation: EditOperation): void {
    const crdtOp = this.crdt.fromEditorOperation(operation)
    this.wsClient.send({
      type: 'edit',
      senderId: this.config.user.id,
      timestamp: Date.now(),
      data: crdtOp,
    })
  }

  private handleConnect(): void {
    this.wsClient.send({
      type: 'join',
      senderId: this.config.user.id,
      timestamp: Date.now(),
      data: { user: this.config.user, roomId: this.config.roomId },
    })
  }

  private handleDisconnect(): void {
    this.events.onUserLeft?.(this.config.user.id)
  }

  private handleMessage(message: CollaborationMessage): void {
    switch (message.type) {
      case 'join':
        this.presence.addUser(message.data as any)
        this.events.onUserJoined?.(message.data as any)
        break
      case 'leave':
        this.presence.removeUser(message.senderId)
        this.events.onUserLeft?.(message.senderId)
        break
      case 'edit':
        this.crdt.applyRemoteOperation(message.data as any)
        this.events.onEdit?.(this.crdt.toEditorOperation(message.data as any))
        break
      case 'cursor':
        this.presence.updateCursor(message.senderId, message.data as any)
        this.events.onCursorChange?.(message.senderId, message.data as any)
        break
    }
  }

  dispose(): void {
    this.disconnect()
  }
}

