'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState } from 'react'
import { MapContainer } from 'react-leaflet'
import { TileLayer } from 'react-leaflet/TileLayer'
import { Marker } from 'react-leaflet/Marker'
import { Popup } from 'react-leaflet/Popup'

const TRAFFIC_REPORTS_API = '/api/traffic-reports'

function createDefaultIcon(): L.Icon {
  return new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
}

function getPosition(row: Record<string, unknown>): [number, number] | null {
  const lat = row.latitude
  const lng = row.longitude
  if (lat == null || lng == null) return null
  return [Number(lat), Number(lng)]
}

export default function Map() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [markerIcon, setMarkerIcon] = useState<L.Icon | null>(null)

  useEffect(() => {
    setMarkerIcon(createDefaultIcon())
  }, [])

  useEffect(() => {
    const params = new URLSearchParams({ status: 'active', limit: '500' })
    fetch(`${TRAFFIC_REPORTS_API}?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <MapContainer
      center={[30.267, -97.743]}
      zoom={11}
      scrollWheelZoom={false}
      style={{ width: '100%', aspectRatio: '16/9', minHeight: '280px', maxHeight: '56vh' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
      />
      {!loading && !error && rows.length === 0 && (
        <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 1000, background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '6px 10px', borderRadius: 6, fontSize: 13 }}>
          No active incidents right now
        </div>
      )}
      {!loading &&
        !error &&
        markerIcon != null &&
        rows.map((row, i) => {
          const pos = getPosition(row)
          if (!pos) return null
          const id = row.traffic_report_id ?? i
          return (
            <Marker key={String(id)} position={pos} icon={markerIcon}>
              <Popup key={String(id)}>
                <div>
                  <strong>{String(row.issue_reported ?? '—')}</strong>
                  <br />
                  {row.address != null && <>{String(row.address)}<br /></>}
                  Status: {String(row.traffic_report_status ?? '—')}
                  {row.agency != null && <> · {String(row.agency)}</>}
                </div>
              </Popup>
            </Marker>
          )
        })}
    </MapContainer>
  )
}
