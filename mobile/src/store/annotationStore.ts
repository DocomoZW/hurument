import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'

export type AnnotationType = 'highlight' | 'note' | 'signature'

export interface Annotation {
  id: string
  meetingId: string
  pageNumber: number
  type: AnnotationType
  x: number
  y: number
  width: number
  height: number
  color: string
  text?: string
  signatureSvg?: string
  createdAt: string
  updatedAt: string
  synced: boolean
  serverId?: string
}

interface AnnotationState {
  annotations: Annotation[]
  _hydrated: boolean
  _hydrate: () => Promise<void>
  _persist: () => Promise<void>
  addAnnotation: (annotation: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt' | 'synced'>) => Annotation
  updateAnnotation: (id: string, updates: Partial<Omit<Annotation, 'id' | 'meetingId'>>) => void
  deleteAnnotation: (id: string) => void
  getAnnotationsForMeeting: (meetingId: string) => Annotation[]
  getAnnotationsForPage: (meetingId: string, pageNumber: number) => Annotation[]
  markSynced: (id: string, serverId: string) => void
  getUnsyncedAnnotations: () => Annotation[]
}

const ANNOTATIONS_KEY = 'grc_nexus_annotations'

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}

async function loadAnnotations(): Promise<Annotation[]> {
  try {
    const raw = await SecureStore.getItemAsync(ANNOTATIONS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Annotation[]
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.error('Failed to load annotations:', e)
    return []
  }
}

async function saveAnnotations(annotations: Annotation[]) {
  try {
    await SecureStore.setItemAsync(ANNOTATIONS_KEY, JSON.stringify(annotations))
  } catch (e) {
    console.error('Failed to save annotations:', e)
  }
}

export const useAnnotationStore = create<AnnotationState>((set, get) => ({
  annotations: [],
  _hydrated: false,

  _hydrate: async () => {
    const data = await loadAnnotations()
    set({ annotations: data, _hydrated: true })
  },

  _persist: async () => {
    const { annotations } = get()
    await saveAnnotations(annotations)
  },

  addAnnotation: (annotation) => {
    const now = new Date().toISOString()
    const newAnnotation: Annotation = {
      ...annotation,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      synced: false,
    }
    set((state) => ({
      annotations: [...state.annotations, newAnnotation],
    }))
    get()._persist()
    return newAnnotation
  },

  updateAnnotation: (id, updates) => {
    set((state) => ({
      annotations: state.annotations.map((a) =>
        a.id === id
          ? { ...a, ...updates, updatedAt: new Date().toISOString(), synced: false }
          : a
      ),
    }))
    get()._persist()
  },

  deleteAnnotation: (id) => {
    set((state) => ({
      annotations: state.annotations.filter((a) => a.id !== id),
    }))
    get()._persist()
  },

  getAnnotationsForMeeting: (meetingId) => {
    return get().annotations.filter((a) => a.meetingId === meetingId)
  },

  getAnnotationsForPage: (meetingId, pageNumber) => {
    return get().annotations.filter((a) => a.meetingId === meetingId && a.pageNumber === pageNumber)
  },

  markSynced: (id, serverId) => {
    set((state) => ({
      annotations: state.annotations.map((a) =>
        a.id === id ? { ...a, synced: true, serverId, updatedAt: new Date().toISOString() } : a
      ),
    }))
    get()._persist()
  },

  getUnsyncedAnnotations: () => {
    return get().annotations.filter((a) => !a.synced)
  },
}))
