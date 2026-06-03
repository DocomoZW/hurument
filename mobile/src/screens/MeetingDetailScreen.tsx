import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import Pdf from 'react-native-pdf'
import { supabase } from '../api/client'
import { useOfflineStore } from '../store/offlineStore'
import { useNetwork } from '../hooks/useNetwork'
import { getLocalPdfPath } from '../utils/download'
import type { Meeting } from './MeetingsScreen'

interface Attendee {
  id: string
  name: string
  role: string
  email: string
  status: string
}

export function MeetingDetailScreen() {
  const route = useRoute<any>()
  const navigation = useNavigation()
  const meeting: Meeting = route.params?.meeting

  const { downloadPack, getLocalPack } = useOfflineStore()
  const { isConnected } = useNetwork()

  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loadingAttendees, setLoadingAttendees] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [localUri, setLocalUri] = useState<string | null>(null)
  const [showPdf, setShowPdf] = useState(false)
  const [pdfError, setPdfError] = useState('')

  useEffect(() => {
    if (!meeting) {
      navigation.goBack()
      return
    }

    // Check if already downloaded
    const checkLocal = async () => {
      const existing = getLocalPack(meeting.id)
      if (existing) {
        setLocalUri(existing.localUri)
        return
      }
      const path = await getLocalPdfPath(meeting.id)
      if (path) setLocalUri(path)
    }
    checkLocal()

    fetchAttendees()
  }, [meeting])

  const fetchAttendees = async () => {
    if (!meeting?.id) return
    setLoadingAttendees(true)

    const { data, error } = await supabase
      .from('board_meeting_attendees')
      .select(`
        status,
        user_profiles (id, name, role, email)
      `)
      .eq('meeting_id', meeting.id)

    if (error) {
      console.error('Attendees fetch error:', error)
    } else if (data) {
      const mapped: Attendee[] = data.map((row: any) => ({
        id: row.user_profiles?.id || '',
        name: row.user_profiles?.name || 'Unknown',
        role: row.user_profiles?.role || '',
        email: row.user_profiles?.email || '',
        status: row.status || 'invited',
      }))
      setAttendees(mapped)
    }

    setLoadingAttendees(false)
  }

  const handleDownload = async () => {
    if (!meeting?.board_pack_url) {
      Alert.alert('No board pack', 'This meeting does not have a board pack available.')
      return
    }
    if (!isConnected) {
      Alert.alert('Offline', 'You need an internet connection to download the board pack.')
      return
    }

    setDownloading(true)
    setDownloadProgress(0)
    setPdfError('')

    try {
      const uri = await downloadPack(meeting.id, meeting.board_pack_url, (progress) => {
        setDownloadProgress(progress)
      })
      setLocalUri(uri)
      Alert.alert('Download complete', 'The board pack has been downloaded successfully.')
    } catch (err: any) {
      Alert.alert('Download failed', err?.message || 'Something went wrong.')
    } finally {
      setDownloading(false)
    }
  }

  const handleOpenPack = () => {
    if (localUri) {
      setShowPdf(true)
      setPdfError('')
    }
  }

  const handleClosePdf = () => {
    setShowPdf(false)
  }

  if (!meeting) return null

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{meeting.title}</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  meeting.status === 'Upcoming'
                    ? '#1A3E6E'
                    : meeting.status === 'In Progress'
                    ? '#C9A84C'
                    : '#666',
              },
            ]}
          >
            <Text style={styles.statusText}>{meeting.status}</Text>
          </View>
        </View>

        <View style={styles.metaCard}>
          <Text style={styles.metaLabel}>Date & Time</Text>
          <Text style={styles.metaValue}>{new Date(meeting.date).toLocaleString()}</Text>

          <Text style={styles.metaLabel}>Location</Text>
          <Text style={styles.metaValue}>{meeting.location}</Text>

          {meeting.description ? (
            <>
              <Text style={styles.metaLabel}>Description</Text>
              <Text style={styles.metaValue}>{meeting.description}</Text>
            </>
          ) : null}
        </View>

        {meeting.agenda_items && meeting.agenda_items.length > 0 ? (
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>Agenda</Text>
            {meeting.agenda_items.map((item, idx) => (
              <View key={idx} style={styles.agendaRow}>
                <Text style={styles.agendaBullet}>•</Text>
                <Text style={styles.agendaItem}>{item}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.metaCard}>
          <Text style={styles.metaLabel}>Board Pack</Text>
          {localUri ? (
            <View style={styles.packActions}>
              <TouchableOpacity style={styles.openButton} onPress={handleOpenPack}>
                <Text style={styles.openButtonText}>Open Pack</Text>
              </TouchableOpacity>
              {isConnected && meeting.board_pack_url ? (
                <TouchableOpacity style={styles.reDownloadButton} onPress={handleDownload} disabled={downloading}>
                  {downloading ? (
                    <ActivityIndicator color="#1A3E6E" size="small" />
                  ) : (
                    <Text style={styles.reDownloadText}>Re-download</Text>
                  )}
                </TouchableOpacity>
              ) : null}
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.downloadButton, downloading && styles.downloadButtonDisabled]}
              onPress={handleDownload}
              disabled={downloading || !isConnected}
            >
              {downloading ? (
                <View style={styles.progressRow}>
                  <ActivityIndicator color="#fff" size="small" style={{ marginRight: 8 }} />
                  <Text style={styles.downloadButtonText}>
                    Downloading… {Math.round(downloadProgress * 100)}%
                  </Text>
                </View>
              ) : (
                <Text style={styles.downloadButtonText}>
                  {isConnected ? 'Download Board Pack' : 'Offline — Download unavailable'}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.metaCard}>
          <Text style={styles.metaLabel}>Attendees</Text>
          {loadingAttendees ? (
            <ActivityIndicator color="#1A3E6E" />
          ) : attendees.length === 0 ? (
            <Text style={styles.emptyAttendees}>No attendees found</Text>
          ) : (
            attendees.map((attendee) => (
              <View key={attendee.id} style={styles.attendeeRow}>
                <View style={styles.attendeeAvatar}>
                  <Text style={styles.attendeeInitial}>
                    {attendee.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.attendeeInfo}>
                  <Text style={styles.attendeeName}>{attendee.name}</Text>
                  <Text style={styles.attendeeRole}>
                    {attendee.role} — {attendee.status}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {showPdf && localUri ? (
        <View style={styles.pdfContainer}>
          <View style={styles.pdfHeader}>
            <Text style={styles.pdfTitle}>Board Pack</Text>
            <TouchableOpacity onPress={handleClosePdf}>
              <Text style={styles.pdfClose}>Close</Text>
            </TouchableOpacity>
          </View>
          <Pdf
            source={{ uri: localUri, cache: false }}
            style={styles.pdf}
            onError={(err: any) => {
              setPdfError(err?.message || 'Failed to load PDF')
              setShowPdf(false)
            }}
            onLoadComplete={(numberOfPages: number) => {
              console.log(`PDF loaded: ${numberOfPages} pages`)
            }}
            renderActivityIndicator={(progress: number) => (
              <View style={styles.pdfLoading}>
                <ActivityIndicator color="#1A3E6E" />
                <Text style={styles.pdfLoadingText}>{Math.round(progress * 100)}%</Text>
              </View>
            )}
          />
          {pdfError ? <Text style={styles.pdfError}>{pdfError}</Text> : null}
        </View>
      ) : null}
    </View>
  )
}

const { height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F1E8' },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A3E6E', flex: 1 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  metaCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metaLabel: { fontSize: 12, color: '#999', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  metaValue: { fontSize: 15, color: '#333', marginBottom: 12 },
  agendaRow: { flexDirection: 'row', marginBottom: 6 },
  agendaBullet: { color: '#C9A84C', fontSize: 15, marginRight: 8 },
  agendaItem: { fontSize: 15, color: '#333', flex: 1 },
  downloadButton: {
    backgroundColor: '#1A3E6E',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  downloadButtonDisabled: { opacity: 0.7 },
  downloadButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  progressRow: { flexDirection: 'row', alignItems: 'center' },
  packActions: { flexDirection: 'row', gap: 12 },
  openButton: {
    backgroundColor: '#C9A84C',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  openButtonText: { color: '#1A3E6E', fontSize: 15, fontWeight: 'bold' },
  reDownloadButton: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A3E6E',
    flex: 1,
  },
  reDownloadText: { color: '#1A3E6E', fontSize: 15, fontWeight: '600' },
  emptyAttendees: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 8 },
  attendeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  attendeeAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A3E6E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  attendeeInitial: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  attendeeInfo: { flex: 1 },
  attendeeName: { fontSize: 15, color: '#333', fontWeight: '600' },
  attendeeRole: { fontSize: 13, color: '#666', marginTop: 2 },
  pdfContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F5F1E8',
    zIndex: 10,
  },
  pdfHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#1A3E6E',
  },
  pdfTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  pdfClose: { fontSize: 16, color: '#C9A84C', fontWeight: '600' },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: height - 80,
  },
  pdfLoading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
    alignItems: 'center',
  },
  pdfLoadingText: { marginTop: 8, color: '#1A3E6E', fontSize: 14 },
  pdfError: { color: '#c00', textAlign: 'center', margin: 12 },
})
