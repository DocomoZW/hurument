import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { supabase } from '../api/client'
import { useAuthStore } from '../store/authStore'
import { useOfflineStore } from '../store/offlineStore'

export interface Meeting {
  id: string
  title: string
  date: string
  status: 'Upcoming' | 'In Progress' | 'Completed'
  location: string
  institution_id: string
  agenda_items: string[] | null
  board_pack_url: string | null
  description: string | null
}

export function MeetingsScreen() {
  const navigation = useNavigation<any>()
  const { user } = useAuthStore()
  const { _hydrate } = useOfflineStore()

  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const fetchMeetings = useCallback(async () => {
    if (!user?.institution_id) return
    setError('')

    const { data, error: supaError } = await supabase
      .from('board_meetings')
      .select('id, title, date, status, location, institution_id, agenda_items, board_pack_url, description')
      .eq('institution_id', user.institution_id)
      .order('date', { ascending: true })

    if (supaError) {
      setError(supaError.message)
    } else {
      setMeetings((data as Meeting[]) || [])
    }
  }, [user?.institution_id])

  useEffect(() => {
    _hydrate()
    fetchMeetings().finally(() => setLoading(false))
  }, [fetchMeetings])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchMeetings()
    setRefreshing(false)
  }, [fetchMeetings])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return '#1A3E6E'
      case 'In Progress':
        return '#C9A84C'
      case 'Completed':
        return '#666'
      default:
        return '#999'
    }
  }

  const renderItem = ({ item }: { item: Meeting }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('MeetingDetail', { meeting: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
      <Text style={styles.location}>{item.location}</Text>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#1A3E6E" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Board Meetings</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={meetings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={meetings.length === 0 ? styles.emptyContainer : styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1A3E6E" />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No upcoming meetings</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F1E8' },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#1A3E6E', paddingTop: 48 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  list: { padding: 16, gap: 12 },
  emptyContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 16, color: '#999' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 16, fontWeight: 'bold', color: '#1A3E6E', flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  date: { fontSize: 14, color: '#333', marginBottom: 4 },
  location: { fontSize: 13, color: '#666' },
  error: { color: '#c00', textAlign: 'center', margin: 12, fontSize: 14 },
})
