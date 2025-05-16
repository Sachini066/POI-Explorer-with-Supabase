'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import PoiSearch from '../components/PoiSearch'
import AddPoi from '../components/AddPoi'
import { useAuth } from '../context/AuthContext'
import { savePoi } from '../lib/poiUtils'

const PoiMap = dynamic(() => import('../components/PoiMap'), { ssr: false })

export default function Page() {
  const { session } = useAuth()

  const [mapPois, setMapPois] = useState([])
  const [selectedPOIs, setSelectedPOIs] = useState([])

  const handleSelectPoi = (poi) => {
    const exists = selectedPOIs.find(p => p.id === poi.id)
    const updated = exists
      ? selectedPOIs.filter(p => p.id !== poi.id)
      : [...selectedPOIs, poi].slice(-2)

    setSelectedPOIs(updated)
    setMapPois(updated)
  }

  const handleAddPoi = async (poi, userId) => {
    if (!session) {
      alert('Please log in first')
      return
    }
    try {
      await savePoi(poi, userId)
      alert('POI saved successfully!')

      setMapPois([poi])
      setSelectedPOIs([poi])
    } catch (err) {
      alert('Failed to save POI: ' + err.message)
    }
  }

  return (
    <>
      <PoiSearch onSelect={handleSelectPoi} />
      <PoiMap pois={mapPois} selectedPois={selectedPOIs} onAddPoi={handleAddPoi} />
      {session && (
        <AddPoi userId={session.user.id} onAddPoi={handleAddPoi} onSelectPoi={handleSelectPoi} />
      )}
    </>
  )
}