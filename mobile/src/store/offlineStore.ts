import { create } from 'zustand'
import {
  documentDirectory,
  writeAsStringAsync,
  readAsStringAsync,
  getInfoAsync,
  deleteAsync,
} from 'expo-file-system/legacy'
import { createPdfDownloadTask } from '../utils/download'

export interface DownloadedPack {
  meetingId: string
  localUri: string
  downloadedAt: string
  fileSize: number | null
}

interface OfflineState {
  packs: Record<string, DownloadedPack>
  lastSyncAt: string | null
  isHydrated: boolean
  _hydrate: () => Promise<void>
  _persist: () => Promise<void>
  downloadPack: (meetingId: string, pdfUrl: string, onProgress?: (progress: number) => void) => Promise<string>
  getLocalPack: (meetingId: string) => DownloadedPack | undefined
  clearOldPacks: (maxAgeDays?: number) => Promise<void>
  setPack: (pack: DownloadedPack) => void
  removePack: (meetingId: string) => Promise<void>
  setLastSync: (timestamp: string) => void
}

const OFFLINE_STORE_PATH = `${documentDirectory}offline_store.json`

async function loadStore(): Promise<{ packs: Record<string, DownloadedPack>; lastSyncAt: string | null }> {
  if (!documentDirectory) return { packs: {}, lastSyncAt: null }
  const info = await getInfoAsync(OFFLINE_STORE_PATH)
  if (!info.exists) return { packs: {}, lastSyncAt: null }
  try {
    const raw = await readAsStringAsync(OFFLINE_STORE_PATH)
    return JSON.parse(raw)
  } catch {
    return { packs: {}, lastSyncAt: null }
  }
}

async function saveStore(state: { packs: Record<string, DownloadedPack>; lastSyncAt: string | null }) {
  if (!documentDirectory) return
  await writeAsStringAsync(OFFLINE_STORE_PATH, JSON.stringify(state))
}

export const useOfflineStore = create<OfflineState>((set, get) => ({
  packs: {},
  lastSyncAt: null,
  isHydrated: false,

  _hydrate: async () => {
    const data = await loadStore()
    set({ packs: data.packs, lastSyncAt: data.lastSyncAt, isHydrated: true })
  },

  _persist: async () => {
    const { packs, lastSyncAt } = get()
    await saveStore({ packs, lastSyncAt })
  },

  downloadPack: async (meetingId: string, pdfUrl: string, onProgress?: (progress: number) => void) => {
    const task = createPdfDownloadTask(meetingId, pdfUrl, onProgress)
    const result = await task.downloadAsync()
    if (!result) throw new Error('Download was cancelled or failed')
    if (result.status !== 200) throw new Error(`Download failed with status ${result.status}`)

    const info = await getInfoAsync(result.uri)
    const pack: DownloadedPack = {
      meetingId,
      localUri: result.uri,
      downloadedAt: new Date().toISOString(),
      fileSize: info.exists && 'size' in info ? (info as any).size : null,
    }

    set((state) => ({
      packs: { ...state.packs, [meetingId]: pack },
    }))
    await get()._persist()
    return result.uri
  },

  getLocalPack: (meetingId: string) => {
    return get().packs[meetingId]
  },

  clearOldPacks: async (maxAgeDays = 7) => {
    const { packs } = get()
    const now = Date.now()
    const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000

    const toDelete: string[] = []
    const remaining: Record<string, DownloadedPack> = {}

    for (const [id, pack] of Object.entries(packs)) {
      const age = now - new Date(pack.downloadedAt).getTime()
      if (age > maxAgeMs) {
        toDelete.push(id)
        try {
          await deleteAsync(pack.localUri)
        } catch {
          // ignore deletion errors
        }
      } else {
        remaining[id] = pack
      }
    }

    set({ packs: remaining })
    await get()._persist()
  },

  setPack: (pack: DownloadedPack) => {
    set((state) => ({
      packs: { ...state.packs, [pack.meetingId]: pack },
    }))
    get()._persist()
  },

  removePack: async (meetingId: string) => {
    const pack = get().packs[meetingId]
    if (pack) {
      try {
        await deleteAsync(pack.localUri)
      } catch {
        // ignore
      }
    }
    set((state) => {
      const next = { ...state.packs }
      delete next[meetingId]
      return { packs: next }
    })
    await get()._persist()
  },

  setLastSync: (timestamp: string) => {
    set({ lastSyncAt: timestamp })
    get()._persist()
  },
}))
