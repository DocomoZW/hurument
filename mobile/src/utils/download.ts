import {
  documentDirectory,
  downloadAsync,
  makeDirectoryAsync,
  getInfoAsync,
  createDownloadResumable,
} from 'expo-file-system/legacy'
import type { DownloadProgressData } from 'expo-file-system/legacy'

const PACKS_DIR = `${documentDirectory}packs/`

export async function ensurePacksDirectory(): Promise<string | null> {
  if (!documentDirectory) return null
  const dirInfo = await getInfoAsync(PACKS_DIR)
  if (!dirInfo.exists) {
    await makeDirectoryAsync(PACKS_DIR, { intermediates: true })
  }
  return PACKS_DIR
}

export async function downloadPdf(
  meetingId: string,
  pdfUrl: string
): Promise<string> {
  const dir = await ensurePacksDirectory()
  if (!dir) throw new Error('Document directory not available')

  const localUri = `${dir}${meetingId}.pdf`

  const result = await downloadAsync(pdfUrl, localUri, {
    headers: {},
  })

  if (result.status !== 200) {
    throw new Error(`Download failed with status ${result.status}`)
  }

  return result.uri
}

export function createPdfDownloadTask(
  meetingId: string,
  pdfUrl: string,
  onProgress?: (progress: number) => void
) {
  const localUri = `${documentDirectory}packs/${meetingId}.pdf`

  const callback = onProgress
    ? (data: DownloadProgressData) => {
        const progress = data.totalBytesExpectedToWrite
          ? data.totalBytesWritten / data.totalBytesExpectedToWrite
          : 0
        onProgress(Math.min(Math.max(progress, 0), 1))
      }
    : undefined

  return createDownloadResumable(pdfUrl, localUri, { headers: {} }, callback)
}

export async function getLocalPdfPath(meetingId: string): Promise<string | null> {
  if (!documentDirectory) return null
  const localUri = `${documentDirectory}packs/${meetingId}.pdf`
  const info = await getInfoAsync(localUri)
  return info.exists && !info.isDirectory ? localUri : null
}
