/**
 * 用户在线状态管理
 */

import type { UserInfo, UserPresence, CursorPosition, SelectionRange } from '../../types/collaboration'

export class UserPresenceManager {
  private users = new Map<string, UserPresence>()
  private currentUserId: string
  private callbacks = new Set<(users: UserPresence[]) => void>()

  constructor(currentUserId: string) {
    this.currentUserId = currentUserId
  }

  addUser(user: UserInfo): void {
    this.users.set(user.id, {
      ...user,
      online: true,
      lastSeen: Date.now(),
    })
    this.notifyChange()
  }

  removeUser(userId: string): void {
    const user = this.users.get(userId)
    if (user) {
      user.online = false
      user.lastSeen = Date.now()
    }
    this.notifyChange()
  }

  updateCursor(userId: string, position: CursorPosition): void {
    const user = this.users.get(userId)
    if (user) {
      user.cursor = position
      user.lastSeen = Date.now()
      this.notifyChange()
    }
  }

  updateSelection(userId: string, selection: SelectionRange): void {
    const user = this.users.get(userId)
    if (user) {
      user.selection = selection
      user.lastSeen = Date.now()
      this.notifyChange()
    }
  }

  getUsers(): UserPresence[] {
    return Array.from(this.users.values())
  }

  getOnlineUsers(): UserPresence[] {
    return this.getUsers().filter((u) => u.online && u.id !== this.currentUserId)
  }

  onChange(callback: (users: UserPresence[]) => void): () => void {
    this.callbacks.add(callback)
    return () => this.callbacks.delete(callback)
  }

  private notifyChange(): void {
    const users = this.getUsers()
    this.callbacks.forEach((cb) => cb(users))
  }

  clear(): void {
    this.users.clear()
    this.notifyChange()
  }
}

