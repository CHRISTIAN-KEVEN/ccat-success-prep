'use client'
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import type { UserResponse, AuthResponse } from '@/lib/authService'

interface AuthContextValue {
  user: UserResponse | null
  isAuthenticated: boolean
  isHydrated: boolean
  saveSession: (res: AuthResponse) => void
  clearSession: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      setUser(stored ? JSON.parse(stored) : null)
    } catch {
      setUser(null)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  const saveSession = useCallback((res: AuthResponse) => {
    localStorage.setItem('accessToken', res.accessToken)
    localStorage.setItem('refreshToken', res.refreshToken)
    localStorage.setItem('user', JSON.stringify(res.user))
    setUser(res.user)
  }, [])

  const clearSession = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isHydrated, saveSession, clearSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
