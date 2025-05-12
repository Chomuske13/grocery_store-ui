import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import './RegisterPage.css';

const { Title, Text } = Typography;

export const RegisterPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            message.success('Registration successful!');
            navigate('/');
        } catch (error) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <Card className="register-card">
                <Title level={2} className="register-title">
                    Create Account
                </Title>
                <Text type="secondary" className="register-subtitle">
                    Sign up to get started
                </Text>

                <Form
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    layout="vertical"
                    className="register-form"
                >
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[
                            { required: true, message: 'Please input your username!' },
                            { min: 4, message: 'Username must be at least 4 characters' },
                            { max: 20, message: 'Username cannot exceed 20 characters' },
                            {
                                pattern: /^[a-zA-Z0-9_]+$/,
                                message: 'Only letters, numbers and underscores allowed',
                            },
                        ]}
                    >
                        <Input placeholder="Enter your username" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: 'Please input your password!' },
                            { min: 8, message: 'Password must be at least 8 characters' },
                        ]}
                    >
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>

                    <Form.Item
                        name="bio"
                        label="Bio (Optional)"
                        rules={[
                            { max: 200, message: 'Bio cannot exceed 200 characters' },
                        ]}
                    >
                        <Input.TextArea rows={3} placeholder="Tell us about yourself" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            className="register-button"
                        >
                            Create Account
                        </Button>
                    </Form.Item>
                </Form>

                <div className="login-link">
                    Already have an account?{' '}
                    <Button type="link" onClick={() => navigate('/login')}>
                        Log in
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default RegisterPage;  // Добавьте эту строку