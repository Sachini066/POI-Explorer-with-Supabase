'use client'

import { useState, useEffect } from 'react'
import { useDatabase } from '../lib/db'
import { v4 as uuidv4 } from 'uuid' // You'll need to install this: npm install uuid

export default function POIManager() {
  const { db, loading, error } = useDatabase()
  const [pois, setPois] = useState([])
  const [newPoi, setNewPoi] = useState({
    name: '',
    latitude: '',
    longitude: '',
    category: 'restaurant'
  })

  // Load POIs when database is ready
  useEffect(() => {
    if (db) {
      loadPois()
    }
  }, [db])

  // Load all POIs from the database
  const loadPois = () => {
    try {
      const results = db.exec('SELECT * FROM pois ORDER BY created_at DESC')
      if (results.length > 0) {
        const poiData = results[0].values.map(row => {
          const columns = results[0].columns
          return columns.reduce((obj, column, index) => {
            obj[column] = row[index]
            return obj
          }, {})
        })
        setPois(poiData)
      } else {
        setPois([])
      }
    } catch (err) {
      console.error('Error loading POIs:', err)
    }
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewPoi(prev => ({ ...prev, [name]: value }))
  }

  // Add a new POI
  const addPoi = (e) => {
    e.preventDefault()
    
    if (!db) return
    
    try {
      const id = uuidv4()
      const userId = 'current-user' // Replace with actual user ID from your auth context
      
      db.run(
        'INSERT INTO pois (id, user_id, name, latitude, longitude, category) VALUES (?, ?, ?, ?, ?, ?)',
        [id, userId, newPoi.name, parseFloat(newPoi.latitude), parseFloat(newPoi.longitude), newPoi.category]
      )
      
      // Reset form
      setNewPoi({
        name: '',
        latitude: '',
        longitude: '',
        category: 'restaurant'
      })
      
      // Reload POIs
      loadPois()
    } catch (err) {
      console.error('Error adding POI:', err)
    }
  }

  // Delete a POI
  const deletePoi = (id) => {
    if (!db) return
    
    try {
      db.run('DELETE FROM pois WHERE id = ?', [id])
      loadPois()
    } catch (err) {
      console.error('Error deleting POI:', err)
    }
  }

  if (loading) return <div>Loading database...</div>
  if (error) return <div>Error loading database: {error.message}</div>

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Points of Interest Manager</h1>
      
      {/* Add POI Form */}
      <form onSubmit={addPoi} style={{ marginBottom: '30px' }}>
        <h2>Add New POI</h2>
        <div style={{ display: 'grid', gap: '15px' }}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newPoi.name}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div>
            <label htmlFor="latitude">Latitude:</label>
            <input
              type="number"
              step="any"
              id="latitude"
              name="latitude"
              value={newPoi.latitude}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div>
            <label htmlFor="longitude">Longitude:</label>
            <input
              type="number"
              step="any"
              id="longitude"
              name="longitude"
              value={newPoi.longitude}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div>
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              value={newPoi.category}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="restaurant">Restaurant</option>
              <option value="hotel">Hotel</option>
              <option value="attraction">Attraction</option>
              <option value="shopping">Shopping</option>
              <option value="other">Other</option>
            </select>
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
            Add POI
          </button>
        </div>
      </form>
      
      {/* POIs List */}
      <div>
        <h2>Your POIs</h2>
        {pois.length === 0 ? (
          <p>No points of interest yet. Add some above!</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {pois.map(poi => (
              <div 
                key={poi.id} 
                style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '4px', 
                  padding: '15px',
                  position: 'relative'
                }}
              >
                <h3>{poi.name}</h3>
                <p>
                  <strong>Coordinates:</strong> {poi.latitude}, {poi.longitude}<br />
                  <strong>Category:</strong> {poi.category}
                </p>
                <button
                  onClick={() => deletePoi(poi.id)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '5px 10px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}