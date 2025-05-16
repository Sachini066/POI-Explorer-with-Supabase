'use client'

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import { useState, useEffect } from 'react'
import L from 'leaflet'
import { Card, Button, Typography } from 'antd'

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
      map.setView(center, 14, { animate: true })
    }
  }, [center, map])
  return null
}

export default function PoiMap({ pois = [], onAddPoi, selectedPois = [] }) {
  const [activePoi, setActivePoi] = useState(null)

  const center =
    pois.length > 0
      ? [parseFloat(pois[0].lat || pois[0].latitude), parseFloat(pois[0].lon || pois[0].longitude)]
      : [51.505, -0.09]

  const initialZoom = pois.length > 0 ? 14 : 2

  const linePositions =
    selectedPois.length === 2
      ? [
          [parseFloat(selectedPois[0].lat), parseFloat(selectedPois[0].lon)],
          [parseFloat(selectedPois[1].lat), parseFloat(selectedPois[1].lon)],
        ]
      : []

  return (
    <Card
      title={<Typography.Title level={4} style={{ margin: 0 }}>Map View</Typography.Title>}
      style={{ width: '100%', maxWidth: 900, margin: '1rem auto', borderRadius: 8, overflow: 'hidden' }}
      bodyStyle={{ padding: 0, height: 420 }}
      bordered
    >
      <MapContainer center={center} zoom={initialZoom} style={{ height: '400px', width: '100%' }}>
        <MapAutoPan center={center} />
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
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
            <div style={{ minWidth: 200 }}>
              <Typography.Title level={5} style={{ marginBottom: 8 }}>
                {activePoi.display_name || activePoi.name}
              </Typography.Title>
              <Typography.Paragraph style={{ marginBottom: 4 }}>
                <b>Latitude:</b> {activePoi.lat || activePoi.latitude}
              </Typography.Paragraph>
              <Typography.Paragraph style={{ marginBottom: 12 }}>
                <b>Longitude:</b> {activePoi.lon || activePoi.longitude}
              </Typography.Paragraph>
              <Button type="primary" block onClick={() => onAddPoi?.(activePoi)}>
                Add to My POIs
              </Button>
            </div>
          </Popup>
        )}

        {linePositions.length === 2 && (
          <Polyline positions={linePositions} pathOptions={{ color: 'red', weight: 4 }} />
        )}
      </MapContainer>
    </Card>
  )
}
