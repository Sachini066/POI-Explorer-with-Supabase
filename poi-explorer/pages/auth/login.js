
'use client'

import { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (values) => {
    setLoading(true)
    const { email, password } = values

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      message.error(error.message)
    } else {
      message.success('Logged in successfully')
      router.push('/') 
    }

    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <h2>Login</h2>
      <Form layout="vertical" onFinish={handleLogin}>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
