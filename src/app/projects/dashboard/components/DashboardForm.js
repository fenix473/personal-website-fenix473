'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Form, Input, Select } from 'antd';

/**
 * Multi-step form: Step 1 = basic descriptions, Step 2 = pick location on big map (target-lock crosshair).
 * On success calls onSuccess(entry) and resets the form.
 * @param {Function} onSuccess - Callback with the created entry so parent can update table data
 * @param {Function} onStepChange - Callback(step) when step changes; parent enables map picker when step === 2
 * @param {Function} registerLocationHandler - Callback(handler) to register form's handleLocationSelect when step 2
 */
export default function DashboardForm({ onSuccess, onStepChange, registerLocationHandler }) {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);

  const handleLocationSelect = useCallback((lat, lng) => {
    form.setFieldsValue({ latitude: lat, longitude: lng });
  }, [form]);

  useEffect(() => {
    onStepChange?.(step);
    registerLocationHandler?.(step === 2 ? handleLocationSelect : null);
  }, [step, onStepChange, registerLocationHandler, handleLocationSelect]);

  async function onFinish(values) {
    try {
      const lat = Number(values.latitude);
      const lng = Number(values.longitude);
      const hasLocation = !Number.isNaN(lat) && !Number.isNaN(lng);
      const link = hasLocation ? `https://www.google.com/maps?q=${lat},${lng}` : '';
      const payload = {
        title: values.projectname,
        status: values.status,
        link,
        type: values.type,
        description: values.description,
        user: values.user,
        latitude: hasLocation ? lat : null,
        longitude: hasLocation ? lng : null,
      };
      const res = await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create dashboard entry');
      const { entry } = await res.json();
      onSuccess(entry);
      form.resetFields();
      setStep(1);
    } catch (e) {
      console.error('Error creating dashboard entry:', e);
    }
  }

  const handleContinue = async () => {
    try {
      await form.validateFields(['projectname', 'type', 'status', 'description']);
      setStep(2);
    } catch (e) {
      console.error('Validation failed:', e);
    }
  };

  return (
    <div className="dashboard-page__form-card">
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Form.Item
          name="projectname"
          label="Report Event"
          rules={[{ required: true, message: 'Tell us what happened!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label="Type of Event"
          rules={[{ required: true, message: 'Please select type of event!' }]}
        >
          <Select>
            <Select.Option value="rf_main">Rf Main</Select.Option>
            <Select.Option value="Absue">Abuse of AI agents</Select.Option>
            <Select.Option value="Exposed">Exposed API</Select.Option>
            <Select.Option value="Stolen">Someone stolen my sweet roll</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select your status!' }]}
        >
          <Select>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Provide any additinal details!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="user"
          label="User"
          rules={[{ required: true, message: 'Please enter your name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="latitude"
          hidden
          rules={[{ required: true, message: 'Click on the map below to place your marker.' }]}
        >
          <Input type="hidden" />
        </Form.Item>
        <Form.Item
          name="longitude"
          hidden
          rules={[{ required: true, message: 'Click on the map below to place your marker.' }]}
        >
          <Input type="hidden" />
        </Form.Item>
        {step === 2 && (
          <p className="location-picker-hint">
            Click on the map below to place your marker, then submit.
          </p>
        )}
        <Form.Item style={{ marginTop: step === 2 ? 8 : 0 }}>
          {step === 1 ? (
            <Button type="primary" onClick={handleContinue}>
              Continue to map
            </Button>
          ) : (
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
}
