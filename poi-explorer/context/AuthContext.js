'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient' // your Supabase client
// import { syncPoisToBackend } from '../lib/syncPoisToBackend' // optional sync function

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize session from Supabase on mount
  useEffect(() => {
    // Get initial session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen to auth state changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        // Optional: sync local POIs when user logs in
        // syncPoisToBackend()
      }
    })

    // Add online syncing event when logged in
    if (typeof window !== 'undefined') {
      const handleOnline = () => {
        if (session) {
          // syncPoisToBackend()
        }
      }
      window.addEventListener('online', handleOnline)

      return () => {
        listener.subscription.unsubscribe()
        window.removeEventListener('online', handleOnline)
      }
    }
  }, [])

  // Persist session to localStorage for quick reload (optional)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (session) {
        localStorage.setItem('userSession', JSON.stringify(session))
      } else {
        localStorage.removeItem('userSession')
      }
    }
  }, [session])

  // Login function using Supabase
  const login = async (email, password) => {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) throw error

    setSession(data.session)
    return data.session
  }

  // Logout function using Supabase
  const logout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setSession(null)
    setLoading(false)
  }

  const value = {
    session,
    loading,
    login,
    logout,
    isAuthenticated: !!session,
    user: session?.user || null,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
