'use client'

import { useState } from 'react'
import { Form, Input, Button, message, Card, Typography } from 'antd'
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
    <Card
      style={{
        maxWidth: 400,
        margin: '80px auto',
        borderRadius: 12,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        padding: '32px 24px',
        backgroundColor: 'white',
      }}
      bordered={false}
    >
      <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
        Register
      </Typography.Title>
      <Form layout="vertical" onFinish={handleRegister}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email address' },
          ]}
        >
          <Input size="large" placeholder="you@example.com" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
          hasFeedback
        >
          <Input.Password size="large" placeholder="At least 6 characters" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
          >
            Register
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
