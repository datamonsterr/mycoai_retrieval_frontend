import { createContext, useContext, useMemo, useState } from 'react'

export type AuthUser = {
  id: string
  email: string
  role: 'all' | 'owner'
}

type AuthContextValue = {
  user: AuthUser | null
  login: (user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readUser(): AuthUser | null {
  if (typeof window === 'undefined') return null

  const stored = window.localStorage.getItem('mycoai.auth')

  if (stored === null) return null

  return JSON.parse(stored) as AuthUser | null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readUser)

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: (next: AuthUser) => {
        window.localStorage.setItem('mycoai.auth', JSON.stringify(next))
        setUser(next)
      },
      logout: () => {
        window.localStorage.setItem('mycoai.auth', JSON.stringify(null))
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
