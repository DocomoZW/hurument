import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSyncQueueStore, type SyncQueueItem, type SyncStatus } from '../store/syncQueue'
import { useNetwork } from '../hooks/useNetwork'

const STATUS_COLORS: Record<SyncStatus, string> = {
  pending: '#C9A84C',
  syncing: '#1A3E6E',
  failed: '#c00',
  synced: '#4caf50',
}

const STATUS_LABELS: Record<SyncStatus, string> = {
  pending: 'Pending',
  syncing: 'Syncing',
  failed: 'Failed',
  synced: 'Synced',
}

export function SyncStatusScreen() {
  const navigation = useNavigation()
  const { queue, isProcessing, processQueue, clearCompleted, _hydrate: hydrateSync } = useSyncQueueStore()
  const { isConnected } = useNetwork()
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    hydrateSync()
  }, [hydrateSync])

  const pendingItems = queue.filter(
    (q) => q.status === 'pending' || q.status === 'failed'
  )
  const completedItems = queue.filter((q) => q.status === 'synced')

  const handleRetry = async () => {
    if (!isConnected) return
    await processQueue()
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await hydrateSync()
    setRefreshing(false)
  }

  const renderItem = ({ item }: { item: SyncQueueItem }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.status] }]} />
        <Text style={styles.itemType}>{item.type}</Text>
        <Text style={[styles.itemStatus, { color: STATUS_COLORS[item.status] }]}>
          {STATUS_LABELS[item.status]}
        </Text>
      </View>
      <Text style={styles.itemTime}>{new Date(item.timestamp).toLocaleString()}</Text>
      {item.retryCount > 0 ? (
        <Text style={styles.itemRetry}>Retries: {item.retryCount}</Text>
      ) : null}
      {item.error ? <Text style={styles.itemError}>{item.error}</Text> : null}
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sync Status</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Pending</Text>
        <Text style={[styles.summaryValue, { color: pendingItems.length > 0 ? '#C9A84C' : '#4caf50' }]}>
          {pendingItems.length}
        </Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionButton, (!isConnected || isProcessing) && styles.actionButtonDisabled]}
          onPress={handleRetry}
          disabled={!isConnected || isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#1A3E6E" size="small" />
          ) : (
            <Text style={styles.actionButtonText}>Retry Now</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={clearCompleted}>
          <Text style={styles.actionButtonText}>Clear Completed</Text>
        </TouchableOpacity>
      </View>

      {!isConnected ? (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineBannerText}>You are offline — sync will resume when connected</Text>
        </View>
      ) : null}

      <FlatList
        data={queue}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={queue.length === 0 ? styles.emptyContainer : styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#1A3E6E" />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyText}>All changes synced</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F1E8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#1A3E6E',
  },
  backButton: { padding: 4 },
  backText: { color: '#C9A84C', fontSize: 16, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  headerSpacer: { width: 60 },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryLabel: { fontSize: 14, color: '#666', fontWeight: '600' },
  summaryValue: { fontSize: 28, fontWeight: 'bold' },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#1A3E6E',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonDisabled: { opacity: 0.5 },
  actionButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  offlineBanner: {
    backgroundColor: '#fff3cd',
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  offlineBannerText: { color: '#856404', fontSize: 13, textAlign: 'center' },
  list: { padding: 12, paddingBottom: 24, gap: 10 },
  emptyContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { alignItems: 'center', marginTop: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#999' },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  itemType: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A3E6E',
  },
  itemStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  itemRetry: {
    fontSize: 12,
    color: '#C9A84C',
  },
  itemError: {
    fontSize: 12,
    color: '#c00',
    marginTop: 4,
  },
})
