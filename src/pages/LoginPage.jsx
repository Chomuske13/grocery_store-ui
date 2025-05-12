import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import './RegisterPage.css'; // Используем те же стили

const { Title, Text } = Typography;

export const LoginPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            const user = await response.json();
            message.success('Login successful!');

            // Сохраняем ID пользователя (без токена)
            localStorage.setItem('userId', user.id);
            navigate(`/account/${user.id}`);
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
                    Welcome Back
                </Title>
                <Text type="secondary" className="register-subtitle">
                    Sign in to continue
                </Text>

                <Form
                    form={form}
                    name="login-form"
                    onFinish={onFinish}
                    layout="vertical"
                    className="register-form"
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[
                            { required: true, message: 'Please input your username!' },
                        ]}
                    >
                        <Input
                            placeholder="Enter your username"
                            autoComplete="off"
                            data-lpignore="true"
                            data-form-type="other"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: 'Please input your password!' },
                        ]}
                    >
                        <Input.Password
                            placeholder="Enter your password"
                            autoComplete="new-password"
                            data-lpignore="true"
                            data-form-type="other"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            className="register-button"
                        >
                            Sign In
                        </Button>
                    </Form.Item>
                </Form>

                <div className="login-link">
                    Don't have an account yet?{' '}
                    <Button type="link" onClick={() => navigate('/register')}>
                        Sign Up
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;