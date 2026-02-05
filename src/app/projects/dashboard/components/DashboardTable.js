'use client';

import { Button, Table } from 'antd';

/**
 * Renders the dashboard entries table with optional delete column for authenticated users.
 * @param {Object[]} dataSource - Table rows
 * @param {Function} setDataSource - State setter for table data
 * @param {Object|null} user - Current user (if authenticated)
 * @param {Function} setUser - State setter for user (e.g. on 401)
 */
export default function DashboardTable({ dataSource, setDataSource, user, setUser }) {
  const formatDate = (v) => (v == null ? '—' : new Date(v).toLocaleString());
  const baseColumns = [
    { title: 'Event', dataIndex: 'title', key: 'title', width: 140, ellipsis: true },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 90, render: (v) => v ?? '—' },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 90 },
    { title: 'Description', dataIndex: 'description', key: 'description', width: 160, ellipsis: true, render: (v) => v ?? '—' },
    { title: 'User', dataIndex: 'user_name', key: 'user_name', width: 100, ellipsis: true, render: (v) => v ?? '—' },
    {
      title: 'Location',
      key: 'location',
      width: 130,
      render: (_, r) => {
        const lat = r.latitude;
        const lng = r.longitude;
        if (lat == null || lng == null) return '—';
        return `${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`;
      },
    },
    {
      title: 'Link',
      dataIndex: 'link',
      key: 'link',
      width: 70,
      render: (v) => (v ? <a href={v} target="_blank" rel="noopener noreferrer">Map</a> : '—'),
    },
    { title: 'Created', dataIndex: 'created_at', key: 'created_at', width: 150, render: formatDate },
  ];

  const deleteColumn = {
    title: '',
    key: 'delete',
    width: 70,
    render: (_, record) => (
      <Button type="link" danger onClick={() => handleDelete(record.id)}>
        Delete
      </Button>
    ),
  };

  const columns = user ? [...baseColumns, deleteColumn] : baseColumns;

  async function handleDelete(id) {
    try {
      const res = await fetch('/api/dashboard', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
        credentials: 'include',
      });
      if (res.status === 401) {
        setUser(null);
        return;
      }
      if (!res.ok) throw new Error('Failed to delete entry');
      setDataSource((prev) => prev.filter((row) => row.id !== id));
    } catch (e) {
      console.error('Error deleting entry:', e);
    }
  }

  return (
    <div className="dashboard-page__table-card">
      <h1>Events Table</h1>
      <div className="dashboard-page__table-wrap">
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="id"
          scroll={{ x: 1000 }}
        />
      </div>
    </div>
  );
}
