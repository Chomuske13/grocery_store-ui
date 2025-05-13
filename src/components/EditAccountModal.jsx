import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';

const EditAccountModal = ({ visible, onCancel, userData, onSave }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            await onSave(values);
            onCancel();
        } catch (error) {
            message.error('Failed to update account: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={visible}
            title="Edit Account"
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
                    Save Changes
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    username: userData.username,
                    bio: userData.bio || '',
                    password: '' // Добавляем поле для пароля
                }}
            >
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item name="bio" label="Bio">
                    <Input.TextArea rows={4} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditAccountModal;