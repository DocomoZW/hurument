import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export function ActionsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Actions</Text>
      <Text style={styles.placeholder}>Action items will appear here</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F1E8' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A3E6E' },
  placeholder: { fontSize: 14, color: '#999', marginTop: 12 },
})
