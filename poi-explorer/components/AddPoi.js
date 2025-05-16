'use client'

import { useState, useEffect } from 'react'
import { Input, Button, message, List, Typography } from 'antd'
import { supabase } from '../lib/supabaseClient'

export default function AddPoi({ userId }) {
  const [name, setName] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [pois, setPois] = useState([])
  const [loadingPois, setLoadingPois] = useState(false)

  // Fetch user's POIs from Supabase on mount and after add
  async function fetchPois() {
    setLoadingPois(true)
    const { data, error } = await supabase
      .from('pois')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    setLoadingPois(false)

    if (error) {
      message.error('Failed to load POIs: ' + error.message)
    } else {
      setPois(data)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchPois()
    }
  }, [userId])

  async function onAddPoiClick() {
    if (!name || !latitude || !longitude) {
      message.warning('Please fill in Name, Latitude, and Longitude')
      return
    }

    if (!userId) {
      message.error('User ID is missing. Please login.')
      return
    }

    const poi = {
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      category,
      user_id: userId,
    }

    setLoading(true)
    const { error } = await supabase.from('pois').insert(poi)
    setLoading(false)

    if (error) {
      message.error('Failed to add POI: ' + error.message)
    } else {
      message.success('POI added successfully!')
      setName('')
      setLatitude('')
      setLongitude('')
      setCategory('')
      fetchPois() // refresh list
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: '1rem', border: '1px solid #ddd', borderRadius: 8, background: '#fafafa' }}>
      <Typography.Title level={4}>Add a New POI</Typography.Title>

      <Input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ marginBottom: 8 }}
      />
      <Input
        type="number"
        step="any"
        placeholder="Latitude"
        value={latitude}
        onChange={e => setLatitude(e.target.value)}
        style={{ marginBottom: 8 }}
      />
      <Input
        type="number"
        step="any"
        placeholder="Longitude"
        value={longitude}
        onChange={e => setLongitude(e.target.value)}
        style={{ marginBottom: 8 }}
      />
      <Input
        placeholder="Category (optional)"
        value={category}
        onChange={e => setCategory(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Button type="primary" onClick={onAddPoiClick} loading={loading} block>
        Add POI
      </Button>

      <Typography.Title level={5} style={{ marginTop: 32 }}>
        My POIs
      </Typography.Title>

      <List
        bordered
        loading={loadingPois}
        dataSource={pois}
        locale={{ emptyText: 'No POIs added yet.' }}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={item.name}
              description={`Lat: ${item.latitude.toFixed(4)}, Lon: ${item.longitude.toFixed(4)}${item.category ? ` — ${item.category}` : ''}`}
            />
          </List.Item>
        )}
      />
    </div>
  )
}
