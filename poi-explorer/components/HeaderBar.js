'use client'

import { Button, Typography, Layout, Space } from 'antd'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'

const { Header } = Layout

export default function HeaderBar() {
  const { session, logout } = useAuth()
  const router = useRouter()

  return (
    <Header
      style={{
        background: 'linear-gradient(90deg, #0052D4 0%, #4364F7 50%, #6FB1FC 100%)',
        padding: '0 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography.Title
        level={3}
        style={{
          color: 'white',
          margin: 0,
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={() => router.push('/')}
      >
        🌍 POI Explorer
      </Typography.Title>

      <Space>
        {session ? (
          <Button
            type="primary"
            danger
            onClick={() => {
              logout()
              router.push('/auth/login')
            }}
          >
            Logout
          </Button>
        ) : (
          <>
            <Button type="default" onClick={() => router.push('/auth/login')}>
              Login
            </Button>
            <Button type="primary" onClick={() => router.push('/auth/register')}>
              Register
            </Button>
          </>
        )}
      </Space>
    </Header>
  )
}
