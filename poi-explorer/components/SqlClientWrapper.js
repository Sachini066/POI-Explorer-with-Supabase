'use client'

import { useEffect } from 'react'
import { useDatabase } from '../lib/localDb'

export default function SqlClientWrapper() {
  const { db, loading, error, getAllPois } = useDatabase()

  useEffect(() => {
    if (!loading && db) {
      const pois = getAllPois()
      console.log('POIs:', pois)
    }
  }, [loading, db])

  if (loading) return <p>Loading local database...</p>
  if (error) return <p>Error loading database</p>

  return <div>✅ Local DB ready</div>
}
