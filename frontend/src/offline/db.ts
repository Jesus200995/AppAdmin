import Dexie from 'dexie'
import type { Table } from 'dexie'

export interface User {
  id: string
  nombre: string
  role: string
  updatedAt: number
}

export interface QueueItem {
  id?: number
  url: string
  method: 'POST' | 'PUT' | 'DELETE'
  body: any
  createdAt: number
}

class LocalDB extends Dexie {
  users!: Table<User, string>
  queue!: Table<QueueItem, number>

  constructor() {
    super('adminDB')
    this.version(1).stores({
      users: 'id, role, updatedAt',
      queue: '++id, method, url, createdAt',
    })
  }
}

export const db = new LocalDB()
