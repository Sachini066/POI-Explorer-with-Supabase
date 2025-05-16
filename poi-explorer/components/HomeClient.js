'use client'

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function HomeClient() {
  const { session, login, logout, loading } = useAuth()
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await login(loginForm.email, loginForm.password)
    } catch (error) {
      console.error('Login failed:', error)
      alert('Login failed. Please try again.')
    }
  }

  const handleChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value })
  }

  if (loading) return <p>Loading...</p>

  if (!session) {
    return (
      <div className="login-container" style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
        <h1>Login</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginForm.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginForm.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#0070f3',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h1>Welcome, {session.user.email}</h1>
      <p>You are now logged in!</p>
      <button
        onClick={logout}
        style={{
          backgroundColor: '#f44336',
          color: 'white',
          padding: '10px 15px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Logout
      </button>
    </div>
  )
}
