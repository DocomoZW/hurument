import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'

interface User {
  id: string
  email: string
  name: string
  role: string
  institution_id: string
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
  biometricEnabled: boolean
  setUser: (user: User | null) => void
  setTokens: (token: string, refreshToken: string) => void
  setBiometricEnabled: (enabled: boolean) => void
  logout: () => void
  restoreSession: () => Promise<void>
}

const TOKEN_KEY = 'grc_nexus_auth_token'
const REFRESH_KEY = 'grc_nexus_refresh_token'
const USER_KEY = 'grc_nexus_user'
const BIOMETRIC_KEY = 'grc_nexus_biometric'

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isLoading: true,
  biometricEnabled: false,

  setUser: (user) => {
    set({ user })
    if (user) SecureStore.setItemAsync(USER_KEY, JSON.stringify(user))
    else SecureStore.deleteItemAsync(USER_KEY)
  },

  setTokens: (token, refreshToken) => {
    set({ token, refreshToken })
    SecureStore.setItemAsync(TOKEN_KEY, token)
    SecureStore.setItemAsync(REFRESH_KEY, refreshToken)
  },

  setBiometricEnabled: (enabled) => {
    set({ biometricEnabled: enabled })
    SecureStore.setItemAsync(BIOMETRIC_KEY, enabled ? 'true' : 'false')
  },

  logout: async () => {
    set({ user: null, token: null, refreshToken: null })
    await SecureStore.deleteItemAsync(TOKEN_KEY)
    await SecureStore.deleteItemAsync(REFRESH_KEY)
    await SecureStore.deleteItemAsync(USER_KEY)
  },

  restoreSession: async () => {
    try {
      const [token, refreshToken, userJson, biometric] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(REFRESH_KEY),
        SecureStore.getItemAsync(USER_KEY),
        SecureStore.getItemAsync(BIOMETRIC_KEY),
      ])

      if (token && userJson) {
        set({
          token,
          refreshToken: refreshToken || null,
          user: JSON.parse(userJson),
          biometricEnabled: biometric === 'true',
        })
      }
    } catch (e) {
      console.error('Session restore failed:', e)
    } finally {
      set({ isLoading: false })
    }
  },
}))
