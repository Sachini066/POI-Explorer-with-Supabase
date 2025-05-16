'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useState, useEffect } from 'react'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

function MapAutoPan({ center }) {
  const map = useMap()

  useEffect(() => {
    if (center) {
      map.setView(center, 14, { animate: true }) // Zoom level 14 is good for POIs
    }
  }, [center, map])

  return null
}

export default function PoiMap({ pois = [], onAddPoi }) {
  const [activePoi, setActivePoi] = useState(null)

  // Center on first POI or fallback to some default location (e.g., London)
  const center =
    pois.length > 0
      ? [parseFloat(pois[0].lat || pois[0].latitude), parseFloat(pois[0].lon || pois[0].longitude)]
      : [51.505, -0.09] // London as default center

  const initialZoom = pois.length > 0 ? 14 : 2

  return (
    <MapContainer center={center} zoom={initialZoom} style={{ height: '400px', width: '100%' }}>
      <MapAutoPan center={center} />

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {pois.map((poi) => (
        <Marker
          key={poi.place_id || poi.id}
          position={[parseFloat(poi.lat || poi.latitude), parseFloat(poi.lon || poi.longitude)]}
          eventHandlers={{ click: () => setActivePoi(poi) }}
        />
      ))}

      {activePoi && (
        <Popup
          position={[parseFloat(activePoi.lat || activePoi.latitude), parseFloat(activePoi.lon || activePoi.longitude)]}
          onClose={() => setActivePoi(null)}
        >
          <div>
            <h4>{activePoi.display_name || activePoi.name}</h4>
            <p>Lat: {activePoi.lat || activePoi.latitude}</p>
            <p>Lon: {activePoi.lon || activePoi.longitude}</p>
            <button onClick={() => onAddPoi(activePoi)}>Add to My POIs</button>
          </div>
        </Popup>
      )}
    </MapContainer>
  )
}
