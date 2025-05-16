'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import PoiSearch from '../components/PoiSearch'
import { useAuth } from '../context/AuthContext'
import { savePoi } from '../lib/poiUtils'
import AddPoi from '../components/AddPoi'

const PoiMap = dynamic(() => import('../components/PoiMap'), {
  ssr: false,
})

export default function Page() {
  const { session } = useAuth()
  const [searchResults, setSearchResults] = useState([])

  const handleSelectPoi = (poi) => setSearchResults([poi])

  // This is the handler passed down to AddPoi
  const handleAddPoi = async (poi, userId) => {
    if (!session) {
      return alert('Please log in first')
    }
    try {
      await savePoi(poi, userId) // your supabase save function
      alert('POI saved successfully!')
      // Optionally update UI / reload POIs
    } catch (err) {
      alert('Failed to save POI: ' + err.message)
    }
  }

  return (
    <>
      <PoiSearch onSelect={handleSelectPoi} />
      <PoiMap pois={searchResults} onAddPoi={handleAddPoi} />
      {session && <AddPoi userId={session.user.id} onAddPoi={handleAddPoi} />}
    </>
  )
}
