import { createContext, useContext, useMemo, useState } from 'react'
import { normalizeRole } from '../utils/auth'

const AuthContext = createContext(null)

const getStoredUser = () => {
  const storedUser = localStorage.getItem('lms-user')
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser)
      const role = normalizeRole(parsed?.role)
      if (!parsed?.email || !role) return null

      return {
        name: parsed.name || parsed.email.split('@')[0] || 'User',
        email: parsed.email,
        role,
        avatar: parsed.avatar || 'https://i.pravatar.cc/120?img=24'
      }
    } catch {
      return null
    }
  }

  const role = normalizeRole(localStorage.getItem('userRole'))
  const email = localStorage.getItem('userEmail')
  const name = localStorage.getItem('userName')
  if (!role || !email) return null

  return {
    name: name || email.split('@')[0] || 'User',
    email,
    role,
    avatar: 'https://i.pravatar.cc/120?img=24'
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser())

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean((localStorage.getItem('lms-token') || localStorage.getItem('userToken')) && getStoredUser())
  )

  const login = payload => {
    const role = normalizeRole(payload.role)
    if (!role) return

    const nextUser = {
      name: payload.name || payload.email?.split('@')[0] || 'User',
      email: payload.email,
      role,
      avatar: payload.avatar || 'https://i.pravatar.cc/120?img=24'
    }

    setUser(nextUser)
    setIsAuthenticated(true)

    localStorage.setItem('lms-user', JSON.stringify(nextUser))
    localStorage.setItem('lms-token', 'dummy-token')

    localStorage.setItem('userName', nextUser.name)
    localStorage.setItem('userRole', nextUser.role)
    localStorage.setItem('userEmail', nextUser.email)
    localStorage.setItem('userToken', 'dummy-token')
    localStorage.setItem('selectedRole', nextUser.role)
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('lms-user')
    localStorage.removeItem('lms-token')
    localStorage.removeItem('userName')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userToken')
  }

  const value = useMemo(() => ({ user, isAuthenticated, login, logout }), [user, isAuthenticated])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
