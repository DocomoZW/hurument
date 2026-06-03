import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useAuthStore } from '../store/authStore'

export function DashboardScreen({ navigation }: any) {
  const { user, logout } = useAuthStore()

  const stats = [
    { label: 'Open Risks', value: '9', color: '#1A3E6E' },
    { label: 'Pending Actions', value: '5', color: '#C9A84C' },
    { label: 'Next Meeting', value: 'Jun 15', color: '#1A3E6E' },
    { label: 'Incidents', value: '3', color: '#c00' },
  ]

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
  logoutButton: { margin: 20, padding: 14, backgroundColor: '#fff', borderRadius: 8, alignItems: 'center' },
  logoutText: { color: '#c00', fontSize: 14, fontWeight: '600' },
})
