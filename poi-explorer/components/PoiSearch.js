'use client'

import { Input, List, Typography, Card } from 'antd'
import { useState } from 'react'

export default function PoiSearch({ onSelect }) {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])

  const handleSearch = async (value) => {
    if (!value) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json`
      )
      const data = await res.json()
      setResults(data)
    } catch (err) {
      console.error('Search failed', err)
      setResults([])
    }
    setLoading(false)
  }

  return (
    <Card
      title={<Typography.Title level={4} style={{ margin: 0 }}>Search Places</Typography.Title>}
      style={{ maxWidth: 600, margin: '1rem auto', borderRadius: 8 }}
      bodyStyle={{ padding: '1rem' }}
    >
      <Input.Search
        placeholder="Search places (e.g., cafe)"
        enterButton="Search"
        loading={loading}
        onSearch={handleSearch}
        allowClear
        size="large"
      />

      <List
        bordered
        dataSource={results}
        locale={{ emptyText: <Typography.Text type="secondary">No results found</Typography.Text> }}
        style={{ marginTop: 16, maxHeight: 300, overflowY: 'auto', borderRadius: 4 }}
        renderItem={(item) => (
          <List.Item
            onClick={() => onSelect(item)}
            style={{ cursor: 'pointer', padding: '12px 16px' }}
            hoverable
          >
            <List.Item.Meta
              title={<Typography.Text strong>{item.display_name}</Typography.Text>}
              description={
                <Typography.Text type="secondary">
                  Lat: {item.lat}, Lon: {item.lon}
                </Typography.Text>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  )
}
