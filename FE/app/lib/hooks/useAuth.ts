import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '../../stores/authStore'
import httpClient from '../httpClient'
import { create } from "../csr"

export function useAuth() {
  const router = useRouter()
  const accessToken = useAuthStore((state) => state.accessToken)
  const refreshToken = useAuthStore((state) => state.refreshToken)
  const falconPublicKey = useAuthStore((state) => state.falconPublicKey)
  const setAccessToken = useAuthStore((state) => state.setAccessToken)
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken)
  const setFALCONSignPublicKey = useAuthStore((state) => state.setFALCONSignPublicKey)
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // If no access token or no user, redirect to login
    console.log('[AUTH] Checking authentication state...')
    if (!accessToken || !refreshToken) {
      console.log('[AUTH] Unauthorized...')
      setLoading(false)
      return
    }
    console.log('[AUTH] Fetching profile...')
    getProfile()
  }, [accessToken, refreshToken, falconPublicKey, router])

  const login = async (username: string, password: string) => {
    try {
      const data = await httpClient.post<{
        accessToken: string
        refreshToken: string
        user: {
          id: string
          username: string
          fullName: string
          email: string
          mfa: {
            enabled: boolean
            email: boolean
            totp: boolean
          }
        }
      }>('/auth/login', { username, password }, { headers: { skipAuthRefresh: true } })

      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)
      httpClient.setAuthHeader(data.accessToken)
      setUser(data.user)
      create(data.user)
      setIsAuthenticated(true)
    } catch (error) {
      throw error
    }
  }

  const mfaLogin = async (
    username: string,
    password: string,
    code: string,
  ) => {
    try {
      const data = await httpClient.post<{
        accessToken: string
        refreshToken: string
        user: {
          id: string
          username: string
          fullName: string
          email: string
          mfa: {
            enabled: boolean
            email: boolean
            totp: boolean
          }
        }
      }>(
        '/auth/login',
        { username, password, code },
        { headers: { skipAuthRefresh: true } },
      )

      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)
      httpClient.setAuthHeader(data.accessToken)
      setUser(data.user)
      setIsAuthenticated(true)
    } catch (error) {
      throw error
    }
  }

  const getProfile = async () => {
    try {
      const data = await httpClient.get<{
        id: string
        username: string
        fullName: string
        email: string
        roleId: string
        mfa: {
          enabled: boolean
          email: boolean
          totp: boolean
        }
      }>('/auth/profile')
      useAuthStore.getState().setUser(data)
      setIsAuthenticated(true)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      throw error
    }
  }

  const logout = useCallback(() => {
    clearAuth()
    setUser(null)
    setIsAuthenticated(false)
  }, [clearAuth, setUser])

  return { user, falconPublicKey, loading, isAuthenticated, login, mfaLogin, logout }
}