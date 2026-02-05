'use client';

import { Spin } from 'antd';

/**
 * Full-viewport loading spinner for the dashboard.
 */
export default function DashboardLoading() {
  return (
    <div
      className="projects dashboard-page"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Spin size="large" />
    </div>
  );
}
