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
  const [selectedPOIs, setSelectedPOIs] = useState([]) // ✅ Fix: define this

  const handleSelectPoi = (poi) => {
    // toggle selection and limit to 2
    const alreadySelected = selectedPOIs.find((p) => p.id === poi.id)
    const updated =
      alreadySelected
        ? selectedPOIs.filter((p) => p.id !== poi.id)
        : [...selectedPOIs, poi].slice(-2)

    setSelectedPOIs(updated)
    setSearchResults(updated) // show selected POIs on the map
  }

  const handleAddPoi = async (poi, userId) => {
    if (!session) {
      return alert('Please log in first')
    }
    try {
      await savePoi(poi, userId)
      alert('POI saved successfully!')
      setSearchResults([poi])
      setSelectedPOIs([poi])
    } catch (err) {
      alert('Failed to save POI: ' + err.message)
    }
  }

  return (
    <>
      <PoiSearch onSelect={handleSelectPoi} />
      <PoiMap
        pois={searchResults}
        selectedPois={selectedPOIs}
        onAddPoi={handleAddPoi}
      />
      {session && (
        <AddPoi
          userId={session.user.id}
          onAddPoi={handleAddPoi}
          onSelectPoi={handleSelectPoi} // list selection
        />
      )}
    </>
  )
}
