"use client";
import dynamic from 'next/dynamic';
import { Button, Table, Form, Input, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import '@/styles/Projects.css';
import '@/styles/Dashboard.css';

// Leaflet uses `window` at load time; load Map only on the client to avoid prerender error.
const Map = dynamic(() => import('@/components/map'), { ssr: false });

export default function DashboardPage() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [totalIncidents, setTotalIncidents] = useState(0);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const [entriesRes, meRes] = await Promise.all([
                    fetch('/api/dashboard'),
                    fetch('/api/auth/me', { credentials: 'include' }),
                ]);
                if (!entriesRes.ok) throw new Error('Failed to fetch dashboard entries');
                const data = await entriesRes.json();
                setDataSource(Array.isArray(data) ? data : data.dashboardEntries ?? data.entries ?? []);
                setTotalIncidents(data.totalIncidents ?? 0);

                if (meRes.ok) {
                    const { user: u } = await meRes.json();
                    setUser(u);
                } else {
                    setUser(null);
                }
            } catch (e) {
                console.error('Error loading dashboard entries:', e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const [form] = Form.useForm();

    const baseColumns = [
        { title: 'Project Name', dataIndex: 'title', key: 'title' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        {
            title: 'Link',
            dataIndex: 'link',
            key: 'link',
            render: (text) => <a href={text} target="_blank" rel="noopener noreferrer">{text}</a>,
        },
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

    async function onFinish(values) {
        try {
            const res = await fetch('/api/dashboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: values.projectname,
                    status: values.status,
                    link: values.link,
                }),
            });
            if (!res.ok) { throw new Error('Failed to create dashboard entry'); }
            const { entry } = await res.json();
            setDataSource((prev) => [entry, ...prev]);
            form.resetFields();
        } catch (e) {
            console.error('Error creating dashboard entry:', e);
        }
    }

    const paperSx = {
        backgroundColor: 'transparent',
        padding: 0,
        boxShadow: 'none',
    };

    if (loading) {
        return (
            <div
                className="projects dashboard-page"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                }}
            >
                <Spin size="large" />
            </div>
        );
    }


    return (
        <div className="projects dashboard-page">
            <Box sx={{ flexGrow: 1, width: '100%' }}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Paper sx={paperSx} component="div">
                            <h1>Dashboard</h1>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper sx={paperSx} component="div">
                            <div className="dashboard-page__table-card">
                                <Table dataSource={dataSource} columns={columns} rowKey="id" />
                            </div>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={paperSx} component="div">
                            <div className="dashboard-page__form-card">
                                <Form onFinish={onFinish} form={form} layout="vertical">
                                    <Form.Item name="projectname" label="Project Name" rules={[{ required: true, message: 'Please input your project name!' }]}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select your status!' }]}>
                                        <Select>
                                            <Select.Option value="active">Active</Select.Option>
                                            <Select.Option value="inactive">Inactive</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="link" label="Link" rules={[{ required: true, message: 'Please input your link!' }]}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">Register</Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid size={12}>
                        <Paper sx={paperSx} component="div">
                            <div className="dashboard-page__map-wrap">
                                <Map />
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Paper sx={paperSx} component="div">
                            <div className="dashboard-page__stats-card">
                                <span className="dashboard-page__stats-label">Total Incidents</span>
                                <span className="dashboard-page__stats-value">{totalIncidents}</span>
                                <span className="dashboard-page__stats-value" style={{ fontSize: '1rem' }}> From February 1st to {new Date().toLocaleDateString('en-GB', {day: 'numeric', month: 'long'})}, 2026</span>
                            </div>
                        </Paper>
                    </Grid>
            </Box>
        </div>
    );
}

