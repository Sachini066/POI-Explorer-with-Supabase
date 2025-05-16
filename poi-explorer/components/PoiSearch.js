'use client'

import { Input, List } from 'antd'
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
    <>
      <Input.Search
        placeholder="Search places (e.g., cafe)"
        enterButton="Search"
        loading={loading}
        onSearch={handleSearch}
        allowClear
      />
      <List
        bordered
        dataSource={results}
        locale={{ emptyText: 'No results found' }}
        style={{ marginTop: 10, maxHeight: 300, overflowY: 'auto' }}
        renderItem={(item) => (
          <List.Item onClick={() => onSelect(item)} style={{ cursor: 'pointer' }}>
            <List.Item.Meta
              title={item.display_name}
              description={`Lat: ${item.lat}, Lon: ${item.lon}`}
            />
          </List.Item>
        )}
      />
    </>
  )
}
