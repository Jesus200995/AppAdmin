import { db } from './db'
import { apiFetch } from '../app/api'

export async function enqueueMutation(item: { url: string; method: 'POST'|'PUT'|'DELETE'; body: any }) {
  await db.queue.add({ ...item, createdAt: Date.now() })
}

export async function processQueue(baseDelay = 300) {
  const items = await db.queue.toArray()
  for (const it of items) {
    try {
      await apiFetch(it.url, {
        method: it.method,
        body: JSON.stringify(it.body),
        headers: { 'Content-Type': 'application/json' }
      })
      await db.queue.delete(it.id!)
    } catch {
      // si falla, dejamos en cola para intentar luego
    }
    await new Promise(r => setTimeout(r, baseDelay))
  }
}
