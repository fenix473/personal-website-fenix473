'use client';

import StatsCard from '@/components/StatsCard';

/**
 * Incidents stats for the dashboard: total count and date range.
 * @param {number} totalIncidents - Total incidents to show
 */
export default function DashboardStats({ totalIncidents }) {
  const subtitle = `From February 1st to ${new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
  })}, 2026`;

  return (
    <StatsCard
      label="Total Incidents"
      value={totalIncidents}
      subtitle={subtitle}
    />
  );
}
