'use client'

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import { useState, useEffect } from 'react'
import L from 'leaflet'

// Fix default marker icons for Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Auto-pan map when center changes
function MapAutoPan({ center }) {
  const map = useMap()

  useEffect(() => {
    if (center) {
      map.setView(center, 14, { animate: true })
    }
  }, [center, map])

  return null
}

export default function PoiMap({ pois = [], onAddPoi, selectedPois = [] }) {
  const [activePoi, setActivePoi] = useState(null)

  // Default map center
  const center =
    pois.length > 0
      ? [parseFloat(pois[0].lat || pois[0].latitude), parseFloat(pois[0].lon || pois[0].longitude)]
      : [51.505, -0.09]

  const initialZoom = pois.length > 0 ? 14 : 2

  // Convert to LatLng pairs
  const linePositions =
    selectedPois.length === 2
      ? [
          [parseFloat(selectedPois[0].lat), parseFloat(selectedPois[0].lon)],
          [parseFloat(selectedPois[1].lat), parseFloat(selectedPois[1].lon)],
        ]
      : []

  return (
    <MapContainer center={center} zoom={initialZoom} style={{ height: '400px', width: '100%' }}>
      <MapAutoPan center={center} />

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Draw markers */}
      {pois.map((poi) => (
        <Marker
          key={poi.place_id || poi.id}
          position={[parseFloat(poi.lat || poi.latitude), parseFloat(poi.lon || poi.longitude)]}
          eventHandlers={{ click: () => setActivePoi(poi) }}
        />
      ))}

      {/* Popup for selected marker */}
      {activePoi && (
        <Popup
          position={[
            parseFloat(activePoi.lat || activePoi.latitude),
            parseFloat(activePoi.lon || activePoi.longitude),
          ]}
          onClose={() => setActivePoi(null)}
        >
          <div>
            <h4>{activePoi.display_name || activePoi.name}</h4>
            <p>Lat: {activePoi.lat || activePoi.latitude}</p>
            <p>Lon: {activePoi.lon || activePoi.longitude}</p>
            <button onClick={() => onAddPoi?.(activePoi)}>Add to My POIs</button>
          </div>
        </Popup>
      )}

      {/* Draw line between 2 selected POIs */}
      {linePositions.length === 2 && (
        <Polyline
          positions={linePositions}
          pathOptions={{ color: 'red', weight: 4 }}
        />
      )}
    </MapContainer>
  )
}
