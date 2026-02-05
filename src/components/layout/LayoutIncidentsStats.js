'use client';

import { useEffect, useState } from 'react';
import StatsCard from '@/components/StatsCard';

/**
 * Fetches total incidents from the dashboard API and renders a StatsCard.
 * Used in the root layout so the count is visible on every page.
 */
export default function LayoutIncidentsStats() {
  const [totalIncidents, setTotalIncidents] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/dashboard');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setTotalIncidents(data.totalIncidents ?? 0);
        }
      } catch (e) {
        if (!cancelled) console.error('Error loading incidents for layout:', e);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (totalIncidents == null) return null;

  const subtitle = `From February 1st to ${new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
  })}, 2026`;

  return (
    <StatsCard
      label="Total Incidents"
      value={totalIncidents}
      subtitle={subtitle}
      className="layout-incidents-stats"
    />
  );
}
