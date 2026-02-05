'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';

const LocationPickerMapInner = dynamic(
    () => import('./LocationPickerMapInner'), 
    { ssr: false }
);

function createCrosshairIcon() {
    return L.divIcon({
        className: 'location-picker-crosshair',
        html: '<div class="location-picker-crosshair-inner"></div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
}

export default function LocationPickerMap({ onLocationSelect }) {
    const [crosshairIcon] = useState(() => createCrosshairIcon());
    return (
      <div className="location-picker-map">
        <p className="location-picker-hint">Move the map and click to place your marker.</p>
        <LocationPickerMapInner
          crosshairIcon={crosshairIcon}
          onLocationSelect={onLocationSelect}
        />
      </div>
    );
  }