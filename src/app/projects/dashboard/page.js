"use client";
import { Button, Table, Form, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import '@/styles/Dashboard.css';




export default function DashboardPage() {

    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const res = await fetch('/api/dashboard');
                if (!res.ok) { throw new Error('Failed to fetch dashboard entries'); }
                const data = await res.json();
                setDataSource(Array.isArray(data) ? data : data.entries ?? [])
            } catch (e) {
                console.error('Error loading dashboard entries:', e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);


    const formItemLayout = {
        labelCol: { 
            xs: { span: 24 },
            sm: { span: 4 },
        },
        wrapperCol: { 
            xs: {span: 14 },
            sm: { span: 14 },
        },
    };

    const [form] = Form.useForm();

    const columns = [
        {
            title: 'Project Name',
            dataIndex: 'title',
            key: 'title',
        },
        { 
            title: 'Status', 
            dataIndex: 'status', 
            key: 'status' 
        },
        {
            title: 'Link',
            dataIndex: 'link',
            key: 'link',
            render: (text) => <a href={text} target='_blank' rel='noopener noreferrer'>{text}</a>,
        }
    ];

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
    return (
        <div className="projects dashboard-page">
            <h1>Dashboard</h1>
            <div className="dashboard-page__table-card">
                <Table dataSource={dataSource} columns={columns} rowKey="id" loading={loading} />
            </div>
            <div className="dashboard-page__form-card">
                <Form
                    onFinish={onFinish}
                    {...formItemLayout}
                    form={form}
                >
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
                    <Form.Item {...formItemLayout}>
                        <Button type="primary" htmlType="submit">Register</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

