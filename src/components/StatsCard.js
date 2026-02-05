'use client';

import '@/styles/StatsCard.css';

/**
 * Reusable stats card: label, main value, and optional subtitle.
 * @param {string} label - Short label (e.g. "Total Incidents")
 * @param {React.ReactNode|number} value - Main value to display
 * @param {string} [subtitle] - Optional subtitle (e.g. date range)
 * @param {string} [className] - Optional extra class for the card container
 */
export default function StatsCard({ label, value, subtitle, className = '' }) {
  return (
    <div className={`stats-card ${className}`.trim()}>
      <span className="stats-card__label">{label}</span>
      <span className="stats-card__value">{value}</span>
      {subtitle != null && subtitle !== '' && (
        <span className="stats-card__subtitle">{subtitle}</span>
      )}
    </div>
  );
}
