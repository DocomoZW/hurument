import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../api/client'
import type { Meeting } from './MeetingsScreen'

export function DashboardScreen() {
  const navigation = useNavigation<any>()
  const { user, logout } = useAuthStore()
  const [nextMeeting, setNextMeeting] = useState<Meeting | null>(null)
  const [loadingMeeting, setLoadingMeeting] = useState(true)

  const stats = [
    { label: 'Open Risks', value: '9', color: '#1A3E6E' },
    { label: 'Pending Actions', value: '5', color: '#C9A84C' },
    { label: 'Incidents', value: '3', color: '#c00' },
  ]

  useEffect(() => {
    async function fetchNextMeeting() {
      if (!user?.institution_id) {
        setLoadingMeeting(false)
        return
      }
      const now = new Date().toISOString()
      const { data, error } = await supabase
        .from('board_meetings')
        .select('id, title, date, status, location, institution_id, agenda_items, board_pack_url, description')
        .eq('institution_id', user.institution_id)
        .gte('date', now)
        .order('date', { ascending: true })
        .limit(1)
        .single()

      if (!error && data) {
        setNextMeeting(data as Meeting)
      }
      setLoadingMeeting(false)
    }
    fetchNextMeeting()
  }, [user?.institution_id])

  const getCountdownText = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - Date.now()
    if (diff <= 0) return 'Starting now'
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    if (days > 0) return `${days}d ${hours}h until meeting`
    return `${hours}h until meeting`
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome, {user?.name || 'Board Member'}</Text>
        <Text style={styles.role}>{user?.role || 'Board Member'}</Text>
      </View>

      <View style={styles.statsRow}>
        {stats.map((stat, idx) => (
          <View key={idx} style={styles.statCard}>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {loadingMeeting ? (
        <View style={styles.meetingCard}>
          <ActivityIndicator color="#1A3E6E" />
        </View>
      ) : nextMeeting ? (
        <TouchableOpacity
          style={styles.meetingCard}
          onPress={() => navigation.navigate('Meetings', { screen: 'MeetingDetail', params: { meeting: nextMeeting } })}
        >
          <Text style={styles.meetingLabel}>Next Meeting</Text>
          <Text style={styles.meetingTitle}>{nextMeeting.title}</Text>
          <Text style={styles.meetingCountdown}>{getCountdownText(nextMeeting.date)}</Text>
          <Text style={styles.meetingDate}>{new Date(nextMeeting.date).toLocaleString()}</Text>
          <Text style={styles.meetingLocation}>{nextMeeting.location}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.meetingCard}>
          <Text style={styles.meetingLabel}>Next Meeting</Text>
          <Text style={styles.noMeetingText}>No upcoming meetings scheduled</Text>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F1E8' },
  header: { padding: 20, backgroundColor: '#1A3E6E', paddingTop: 48 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  role: { fontSize: 14, color: '#C9A84C', marginTop: 4 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 12 },
  statCard: {
    backgroundColor: '#fff', borderRadius: 8, padding: 16, width: '47%',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  statValue: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  meetingCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 12,
    marginTop: 4,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#C9A84C',
  },
  meetingLabel: { fontSize: 12, color: '#999', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  meetingTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A3E6E', marginBottom: 6 },
  meetingCountdown: { fontSize: 14, color: '#C9A84C', fontWeight: '600', marginBottom: 4 },
  meetingDate: { fontSize: 13, color: '#333', marginBottom: 2 },
  meetingLocation: { fontSize: 13, color: '#666' },
  noMeetingText: { fontSize: 14, color: '#999', fontStyle: 'italic' },
  logoutButton: { margin: 20, padding: 14, backgroundColor: '#fff', borderRadius: 8, alignItems: 'center' },
  logoutText: { color: '#c00', fontSize: 14, fontWeight: '600' },
})
