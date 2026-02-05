'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'

const TRAFFIC_REPORTS_API = '/api/traffic-reports'

/** Police car icon for APD / traffic-reports API markers. */
function createApdCarIcon(): L.DivIcon {
  const carPath =
    'M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 400 256s32 12.76 32 31.9-12.8 31.9-32 31.9z'
  const html = `<div class="apd-marker-icon"><svg class="apd-marker-car" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="${carPath}"/></svg></div>`
  return L.divIcon({
    className: 'apd-marker-icon-wrap',
    html,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  })
}

/** Exclamation circle icon for user-generated markers (dashboard form ticks). */
function createUserMarkerIcon(): L.DivIcon {
  const exclamationPath =
    'M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z'
  const html = `<div class="user-marker-icon"><svg class="user-marker-exclamation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="${exclamationPath}"/></svg></div>`
  return L.divIcon({
    className: 'user-marker-icon-wrap',
    html,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  })
}

function getPosition(row: Record<string, unknown>): [number, number] | null {
  const lat = row.latitude
  const lng = row.longitude
  if (lat == null || lng == null) return null
  return [Number(lat), Number(lng)]
}

/**
 * When pickerMode is true, listens for mousemove and click.
 * Crosshair follows mouse; click places or replaces the tick.
 */
function MapEventHandler({
  pickerMode,
  onMouseMove,
  onLocationSelect,
}: {
  pickerMode: boolean
  onMouseMove?: (x: number, y: number) => void
  onLocationSelect?: (lat: number, lng: number) => void
}) {
  useMapEvents({
    mousemove: (e) => {
      if (pickerMode && onMouseMove) {
        const { x, y } = e.containerPoint
        onMouseMove(x, y)
      }
    },
    click: (e) => {
      if (pickerMode && onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng)
      }
    },
  })
  return null
}

type MapProps = {
  pickerMode?: boolean
  onLocationSelect?: (lat: number, lng: number) => void
  userEntries?: Record<string, unknown>[]
}

function getUserPosition(row: Record<string, unknown>): [number, number] | null {
  const lat = row.latitude
  const lng = row.longitude
  if (lat == null || lng == null) return null
  const nLat = Number(lat)
  const nLng = Number(lng)
  if (Number.isNaN(nLat) || Number.isNaN(nLng)) return null
  return [nLat, nLng]
}

export default function Map({ pickerMode = false, onLocationSelect, userEntries = [] }: MapProps) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apdCarIcon, setApdCarIcon] = useState<L.DivIcon | null>(null)
  const [userMarkerIcon, setUserMarkerIcon] = useState<L.DivIcon | null>(null)
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null)

  useEffect(() => {
    setApdCarIcon(createApdCarIcon())
    setUserMarkerIcon(createUserMarkerIcon())
  }, [])

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedPosition([lat, lng])
    onLocationSelect?.(lat, lng)
  }

  useEffect(() => {
    if (!pickerMode) {
      setSelectedPosition(null)
      setMousePosition(null)
    }
  }, [pickerMode])

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
      style={{ width: '100%', height: '100%', minHeight: '320px', aspectRatio: 'auto' }}
      className={pickerMode ? 'map-picker-mode' : undefined}
    >
      {pickerMode && (
        <div
          className="map-crosshair-overlay"
          aria-hidden
          style={
            mousePosition
              ? ({ '--mouse-x': `${mousePosition.x}px`, '--mouse-y': `${mousePosition.y}px` } as React.CSSProperties)
              : undefined
          }
        >
          <div className="map-crosshair map-crosshair--follows-mouse" />
        </div>
      )}
      <MapEventHandler
        pickerMode={pickerMode}
        onMouseMove={(x, y) => setMousePosition({ x, y })}
        onLocationSelect={handleLocationSelect}
      />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
      />
      {pickerMode && selectedPosition != null && userMarkerIcon != null && (
        <Marker position={selectedPosition} icon={userMarkerIcon} interactive={false} />
      )}
      {userMarkerIcon != null &&
        userEntries.map((row, i) => {
          const pos = getUserPosition(row)
          if (!pos) return null
          const id = row.id ?? `user-${i}`
          return (
            <Marker key={String(id)} position={pos} icon={userMarkerIcon}>
              <Popup>
                <div>
                  <strong>{String(row.title ?? '—')}</strong>
                  <br />
                  {row.type != null && <>{String(row.type)}<br /></>}
                  Status: {String(row.status ?? '—')}
                  {row.user_name != null && <> · {String(row.user_name)}</>}
                </div>
              </Popup>
            </Marker>
          )
        })}
      {!loading && !error && rows.length === 0 && userEntries.length === 0 && (
        <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 1000, background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '6px 10px', borderRadius: 6, fontSize: 13 }}>
          No active incidents right now
        </div>
      )}
      {!loading &&
        !error &&
        apdCarIcon != null &&
        rows.map((row, i) => {
          const pos = getPosition(row)
          if (!pos) return null
          const id = row.traffic_report_id ?? i
          return (
            <Marker key={String(id)} position={pos} icon={apdCarIcon}>
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
