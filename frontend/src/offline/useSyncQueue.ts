import { useEffect } from 'react'
import { processQueue } from './queue'

export function useSyncQueue() {
  useEffect(() => {
    const onOnline = () => processQueue()
    window.addEventListener('online', onOnline)
    // intento inicial (por si quedó algo)
    processQueue()
    return () => window.removeEventListener('online', onOnline)
  }, [])
}
