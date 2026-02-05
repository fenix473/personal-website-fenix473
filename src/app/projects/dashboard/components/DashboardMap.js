'use client';

import dynamic from 'next/dynamic';

/** Leaflet uses `window` at load time; load Map only on the client to avoid prerender error. */
const Map = dynamic(() => import('@/components/map'), { ssr: false });

/**
 * Dashboard map card wrapper (traffic/incidents map).
 * When pickerMode is true, shows crosshair overlay; click on map calls onLocationSelect(lat, lng).
 * Shows user-generated entries (with lat/lng) as shield icons on the map.
 * @param {boolean} pickerMode - Whether map is in location-picker mode
 * @param {Function} onLocationSelect - Callback (lat, lng) when user clicks map in picker mode
 * @param {Object[]} userEntries - User-generated dashboard entries (from form) to show as shield markers
 */
export default function DashboardMap({ pickerMode = false, onLocationSelect, userEntries = [] }) {
  return (
    <div className="dashboard-page__map-wrap">
      <Map
        pickerMode={pickerMode}
        onLocationSelect={onLocationSelect}
        userEntries={userEntries}
      />
    </div>
  );
}
