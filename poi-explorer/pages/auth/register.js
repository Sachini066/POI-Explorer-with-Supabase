
'use client'

import { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Register() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (values) => {
    setLoading(true)
    const { email, password } = values

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      message.error(error.message)
    } else {
      message.success('Registered successfully. Please check your email to confirm.')
      router.push('/auth/login')
    }

    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <h2>Register</h2>
      <Form layout="vertical" onFinish={handleRegister}>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
