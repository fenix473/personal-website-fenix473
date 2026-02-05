'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * Handles mousemove (update preview) and click (place marker) on the map.
 */
function MapEventHandler({ onMouseMove, onMapClick }) {
  useMapEvents({
    mousemove: (e) => onMouseMove(e.latlng.lat, e.latlng.lng),
    click: (e) => onMapClick(e.latlng.lat, e.latlng.lng),
  });
  return null;
}

/**
 * Map with crosshair that follows the mouse; click to place a marker.
 * Calls onLocationSelect(lat, lng) when user clicks.
 */
export default function LocationPickerMapInner({ crosshairIcon, onLocationSelect }) {
  const [preview, setPreview] = useState(null);
  const [selected, setSelected] = useState(null);

  const handleMouseMove = (lat, lng) => {
    setPreview([lat, lng]);
  };

  const handleClick = (lat, lng) => {
    setSelected([lat, lng]);
    onLocationSelect(lat, lng);
  };

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
      <MapEventHandler onMouseMove={handleMouseMove} onMapClick={handleClick} />
      {preview && (
        <Marker position={preview} icon={crosshairIcon} interactive={false} />
      )}
      {selected && (
        <Marker position={selected} icon={crosshairIcon} />
      )}
    </MapContainer>
  );
}