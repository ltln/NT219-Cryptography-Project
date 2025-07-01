import { User } from '../types/user'
import { create } from 'zustand'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  falconPublicKey: string | null
  user: User | null
  setAccessToken: (accessToken: string) => void
  setRefreshToken: (refreshToken: string) => void
  setFALCONSignPublicKey: (publicKey: string) => void
  clearAuth: () => void
  setUser: (user: User | null) => void
}

const LOCAL_STORAGE_ACCESS_KEY = 'accessToken'
const LOCAL_STORAGE_REFRESH_KEY = 'refreshToken'
const LOCAL_STORAGE_FALCON_PUBLIC_KEY = 'falconPublicKey'

const getLocalStorageToken = (key: string): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(key)
}

const useAuthStore = create<AuthState>((set) => ({
  accessToken: getLocalStorageToken(LOCAL_STORAGE_ACCESS_KEY),
  refreshToken: getLocalStorageToken(LOCAL_STORAGE_REFRESH_KEY),
  falconPublicKey: getLocalStorageToken(LOCAL_STORAGE_FALCON_PUBLIC_KEY),
  user: null,

  setAccessToken: (accessToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_ACCESS_KEY, accessToken)
    }
    set({ accessToken })
  },

  setRefreshToken: (refreshToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_REFRESH_KEY, refreshToken)
    }
    set({ refreshToken })
  },

  setFALCONSignPublicKey: (publicKey) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_FALCON_PUBLIC_KEY, publicKey)
    }
    set({ falconPublicKey: publicKey })
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_ACCESS_KEY)
      localStorage.removeItem(LOCAL_STORAGE_REFRESH_KEY)
    }
    set({ accessToken: null, refreshToken: null, user: null })
  },

  setUser: (user) => set({ user }),
}))

export default useAuthStore