'use client'

import { useState, useEffect } from 'react'
import { Input, Button, message, List, Typography, Row, Col, Card } from 'antd'
import { supabase } from '../lib/supabaseClient'
import { haversineDistance } from '../lib/haversine'

export default function AddPoi({ userId, onAddPoi, onSelectPoi }) {
  const [name, setName] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [pois, setPois] = useState([])
  const [loadingPois, setLoadingPois] = useState(false)

  const [selectedPOIs, setSelectedPOIs] = useState([])
  const [distance, setDistance] = useState(null)

  useEffect(() => {
    if (userId) fetchPois()
  }, [userId])

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
      lat: parseFloat(latitude),
      lon: parseFloat(longitude),
      category,
      user_id: userId,
    }

    setLoading(true)
    const { error } = await supabase.from('pois').insert([poi])
    setLoading(false)

    if (error) {
      message.error('Failed to add POI: ' + error.message)
    } else {
      message.success('POI added successfully!')
      setName('')
      setLatitude('')
      setLongitude('')
      setCategory('')
      fetchPois()
      onAddPoi?.(poi, userId)
    }
  }

  const handleSelect = (poi) => {
    const exists = selectedPOIs.find(p => p.id === poi.id)
    const updated = exists
      ? selectedPOIs.filter(p => p.id !== poi.id)
      : [...selectedPOIs, poi].slice(-2)

    setSelectedPOIs(updated)

    if (updated.length === 2) {
      const [a, b] = updated
      const dist = haversineDistance(a.lat, a.lon, b.lat, b.lon)
      setDistance(dist.toFixed(2))
    } else {
      setDistance(null)
    }

    onSelectPoi?.(poi)
  }

  return (
    <Card
      style={{ maxWidth: 900, margin: '2rem auto', borderRadius: 12, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
      bodyStyle={{ padding: '24px' }}
    >
      <Row gutter={32}>
        {/* Left: Add POI form */}
        <Col xs={24} md={12}>
          <Typography.Title level={4} style={{ marginBottom: 24 }}>
            Add a New POI
          </Typography.Title>

          <Input
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ marginBottom: 16 }}
            size="large"
          />
          <Input
            type="number"
            step="any"
            placeholder="Latitude"
            value={latitude}
            onChange={e => setLatitude(e.target.value)}
            style={{ marginBottom: 16 }}
            size="large"
          />
          <Input
            type="number"
            step="any"
            placeholder="Longitude"
            value={longitude}
            onChange={e => setLongitude(e.target.value)}
            style={{ marginBottom: 16 }}
            size="large"
          />
          <Input
            placeholder="Category (optional)"
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ marginBottom: 24 }}
            size="large"
          />
          <Button type="primary" onClick={onAddPoiClick} loading={loading} block size="large">
            Add POI
          </Button>
        </Col>

        {/* Right: POI List */}
        <Col xs={24} md={12}>
          <Typography.Title level={4} style={{ marginBottom: 24 }}>
            My POIs
          </Typography.Title>

          <List
            bordered
            loading={loadingPois}
            dataSource={pois}
            locale={{ emptyText: 'No POIs added yet.' }}
            style={{ maxHeight: 420, overflowY: 'auto', borderRadius: 8 }}
            renderItem={item => (
              <List.Item
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedPOIs.some(p => p.id === item.id) ? '#e6f7ff' : '',
                }}
                onClick={() => handleSelect(item)}
                key={item.id}
                hoverable
              >
                <List.Item.Meta
                  title={item.name}
                  description={`Lat: ${item.lat}, Lon: ${item.lon}${item.category ? ` — ${item.category}` : ''}`}
                />
              </List.Item>
            )}
          />

          {distance && (
            <Typography.Text style={{ marginTop: 16, display: 'block', fontWeight: 'bold' }}>
              📏 Distance between selected POIs: {distance} km
            </Typography.Text>
          )}
        </Col>
      </Row>
    </Card>
  )
}
