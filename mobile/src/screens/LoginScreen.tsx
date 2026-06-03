import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../api/client'

export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser, setTokens } = useAuthStore()

  async function handleLogin() {
    setError('')
    setLoading(true)

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (data.session) {
      setTokens(data.session.access_token, data.session.refresh_token)

      // Fetch user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id, name, role, institution_id')
        .eq('id', data.session.user.id)
        .single()

      if (profile) {
        setUser({
          id: profile.id,
          email: data.session.user.email || '',
          name: profile.name,
          role: profile.role,
          institution_id: profile.institution_id,
        })
      }
    }

    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GRC-Nexus</Text>
      <Text style={styles.subtitle}>Board Member Access</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F5F1E8' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1A3E6E', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 32 },
  input: {
    backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 12,
    fontSize: 16, borderWidth: 1, borderColor: '#ddd', color: '#333',
  },
  button: {
    backgroundColor: '#1A3E6E', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  error: { color: '#c00', textAlign: 'center', marginBottom: 12, fontSize: 14 },
})
