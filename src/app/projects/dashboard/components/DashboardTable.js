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
    { title: 'Event', dataIndex: 'title', key: 'title' },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (v) => v ?? '—' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true, render: (v) => v ?? '—' },
    { title: 'User', dataIndex: 'user_name', key: 'user_name', render: (v) => v ?? '—' },
    {
      title: 'Location',
      key: 'location',
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
      render: (v) => (v ? <a href={v} target="_blank" rel="noopener noreferrer">Map</a> : '—'),
    },
    { title: 'Created', dataIndex: 'created_at', key: 'created_at', render: formatDate },
  ];

  const deleteColumn = {
    title: '',
    key: 'delete',
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
      <Table dataSource={dataSource} columns={columns} rowKey="id" />
    </div>
  );
}
