import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import { supabase } from '../api/client'

export type SyncOperationType =
  | 'CREATE_ANNOTATION'
  | 'UPDATE_ANNOTATION'
  | 'DELETE_ANNOTATION'
  | 'UPDATE_ACTION_STATUS'
  | 'ACKNOWLEDGE_POLICY'

export type SyncStatus = 'pending' | 'syncing' | 'failed' | 'synced'

export interface SyncQueueItem {
  id: string
  type: SyncOperationType
  payload: Record<string, unknown>
  timestamp: string
  retryCount: number
  status: SyncStatus
  error?: string
}

interface SyncQueueState {
  queue: SyncQueueItem[]
  isProcessing: boolean
  _hydrated: boolean
  _hydrate: () => Promise<void>
  _persist: () => Promise<void>
  enqueue: (operation: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount' | 'status'>) => SyncQueueItem
  dequeue: (id: string) => void
  markSyncing: (id: string) => void
  markSynced: (id: string) => void
  markFailed: (id: string, error?: string) => void
  getPending: () => SyncQueueItem[]
  processQueue: () => Promise<void>
  clearCompleted: () => void
  getPendingCount: () => number
}

const SYNC_QUEUE_KEY = 'grc_nexus_sync_queue'
const MAX_RETRIES = 3

function generateId(): string {
  return `sync_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}

async function loadQueue(): Promise<SyncQueueItem[]> {
  try {
    const raw = await SecureStore.getItemAsync(SYNC_QUEUE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SyncQueueItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.error('Failed to load sync queue:', e)
    return []
  }
}

async function saveQueue(queue: SyncQueueItem[]) {
  try {
    await SecureStore.setItemAsync(SYNC_QUEUE_KEY, JSON.stringify(queue))
  } catch (e) {
    console.error('Failed to save sync queue:', e)
  }
}

async function syncItemToSupabase(item: SyncQueueItem): Promise<boolean> {
  try {
    switch (item.type) {
      case 'CREATE_ANNOTATION':
      case 'UPDATE_ANNOTATION': {
        const payload = item.payload as {
          meetingId: string
          pageNumber: number
          type: string
          x: number
          y: number
          width: number
          height: number
          color: string
          text?: string
          signatureSvg?: string
          serverId?: string
        }
        if (item.type === 'CREATE_ANNOTATION') {
          const { error } = await supabase.from('board_pack_annotations').insert({
            meeting_id: payload.meetingId,
            page_number: payload.pageNumber,
            type: payload.type,
            x: payload.x,
            y: payload.y,
            width: payload.width,
            height: payload.height,
            color: payload.color,
            text: payload.text || null,
            signature_svg: payload.signatureSvg || null,
          })
          if (error) throw error
        } else {
          const { error } = await supabase
            .from('board_pack_annotations')
            .update({
              page_number: payload.pageNumber,
              type: payload.type,
              x: payload.x,
              y: payload.y,
              width: payload.width,
              height: payload.height,
              color: payload.color,
              text: payload.text || null,
              signature_svg: payload.signatureSvg || null,
            })
            .eq('id', payload.serverId || '')
          if (error) throw error
        }
        return true
      }
      case 'DELETE_ANNOTATION': {
        const payload = item.payload as { serverId: string }
        const { error } = await supabase.from('board_pack_annotations').delete().eq('id', payload.serverId)
        if (error) throw error
        return true
      }
      case 'UPDATE_ACTION_STATUS': {
        const payload = item.payload as { actionId: string; status: string }
        const { error } = await supabase
          .from('board_actions')
          .update({ status: payload.status })
          .eq('id', payload.actionId)
        if (error) throw error
        return true
      }
      case 'ACKNOWLEDGE_POLICY': {
        const payload = item.payload as { policyId: string; userId: string }
        const { error } = await supabase.from('policy_acknowledgments').insert({
          policy_id: payload.policyId,
          user_id: payload.userId,
          acknowledged_at: new Date().toISOString(),
        })
        if (error) throw error
        return true
      }
      default:
        return false
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`Sync failed for ${item.type}:`, message)
    return false
  }
}

export const useSyncQueueStore = create<SyncQueueState>((set, get) => ({
  queue: [],
  isProcessing: false,
  _hydrated: false,

  _hydrate: async () => {
    const data = await loadQueue()
    set({ queue: data, _hydrated: true })
  },

  _persist: async () => {
    const { queue } = get()
    await saveQueue(queue)
  },

  enqueue: (operation) => {
    const item: SyncQueueItem = {
      ...operation,
      id: generateId(),
      timestamp: new Date().toISOString(),
      retryCount: 0,
      status: 'pending',
    }
    set((state) => ({
      queue: [...state.queue, item],
    }))
    get()._persist()
    return item
  },

  dequeue: (id) => {
    set((state) => ({
      queue: state.queue.filter((q) => q.id !== id),
    }))
    get()._persist()
  },

  markSyncing: (id) => {
    set((state) => ({
      queue: state.queue.map((q) => (q.id === id ? { ...q, status: 'syncing' as SyncStatus } : q)),
    }))
    get()._persist()
  },

  markSynced: (id) => {
    set((state) => ({
      queue: state.queue.map((q) =>
        q.id === id ? { ...q, status: 'synced' as SyncStatus, updatedAt: new Date().toISOString() } : q
      ),
    }))
    get()._persist()
  },

  markFailed: (id, error) => {
    set((state) => ({
      queue: state.queue.map((q) =>
        q.id === id
          ? {
              ...q,
              status: 'failed' as SyncStatus,
              retryCount: q.retryCount + 1,
              error: error || 'Unknown error',
            }
          : q
      ),
    }))
    get()._persist()
  },

  getPending: () => {
    return get().queue.filter((q) => q.status === 'pending' || q.status === 'failed')
  },

  getPendingCount: () => {
    return get().queue.filter((q) => q.status === 'pending' || q.status === 'failed').length
  },

  clearCompleted: () => {
    set((state) => ({
      queue: state.queue.filter((q) => q.status !== 'synced'),
    }))
    get()._persist()
  },

  processQueue: async () => {
    const { queue, isProcessing } = get()
    if (isProcessing) return

    const pending = queue.filter((q) => q.status === 'pending' || (q.status === 'failed' && q.retryCount < MAX_RETRIES))
    if (pending.length === 0) return

    set({ isProcessing: true })

    for (const item of pending) {
      get().markSyncing(item.id)
      const success = await syncItemToSupabase(item)
      if (success) {
        get().markSynced(item.id)
      } else {
        get().markFailed(item.id, 'Server sync failed')
      }
    }

    set({ isProcessing: false })
    get()._persist()
  },
}))
