import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import './RegisterPage.css';

const { Title, Text } = Typography;

export const LoginPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [accountNotFound, setAccountNotFound] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        setAccountNotFound(false); // Сбрасываем состояние перед новым запросом
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
/*
            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = { message: 'Login failed' };
                }

                let errorMessage = errorData.message || 'Login failed';
/*
                if (response.status === 404 || errorData.message?.toLowerCase().includes('not found')) {
                    errorMessage = 'Account not found. Please check your credentials or sign up.';
                    setAccountNotFound(true); // Устанавливаем состояние для отображения в UI
                }

                throw new Error(errorMessage);
            }
*/
            const data = await response.json();
            message.success('Login successful!');
            localStorage.setItem('userId', data.id);
            navigate(`/account/${data.id}`);
        } catch (error) {
            message.error(error.message);
            form.setFields([{ name: 'password', errors: [] }]);
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

                {/* Блок с сообщением об ошибке */}
                {accountNotFound && (
                    <div className="error-message" style={{ color: '#ff4d4f', marginBottom: 16 }}>
                        Account not found. Please check your credentials or sign up.
                    </div>
                )}

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