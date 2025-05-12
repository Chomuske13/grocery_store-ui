import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import './RegisterPage.css';

const { Title, Text } = Typography;

export const RegisterPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Динамически генерируем случайные имена для полей
    const [fieldNames] = useState({
        username: `username_${Math.random().toString(36).substring(2, 10)}`,
        password: `password_${Math.random().toString(36).substring(2, 10)}`,
        bio: `bio_${Math.random().toString(36).substring(2, 10)}`
    });

    useEffect(() => {
        // Дополнительная защита - изменение типа поля через секунду после загрузки
        const timer = setTimeout(() => {
            const usernameInput = document.querySelector(`[name="${fieldNames.username}"]`);
            const passwordInput = document.querySelector(`[name="${fieldNames.password}"]`);

            if (usernameInput) {
                usernameInput.setAttribute('autocomplete', 'off');
                usernameInput.setAttribute('data-lpignore', 'true');
            }
            if (passwordInput) {
                passwordInput.setAttribute('autocomplete', 'new-password');
                passwordInput.setAttribute('data-lpignore', 'true');
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [fieldNames]);

    const onFinish = async (values) => {
        // Преобразуем обратно в ожидаемые сервером имена полей
        const transformedValues = {
            username: values[fieldNames.username],
            password: values[fieldNames.password],
            bio: values[fieldNames.bio]
        };

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transformedValues),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.message.includes("Username already exists")) {
                    form.setFields([{
                        name: fieldNames.username,
                        errors: ['This username is already taken'],
                    }]);
                    message.error('This username is already taken');
                } else if (data.message.includes("Password already exists")) {
                    form.setFields([{
                        name: fieldNames.password,
                        errors: ['This password is already in use'],
                    }]);
                    message.error('This password is already in use');
                } else {
                    message.error(data.message || 'Registration failed');
                }
                return;
            }

            message.success('Registration successful!');
            navigate('/');
        } catch (error) {
            message.error('Connection error. Please try again later.');
            console.error('Registration error:', error);
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
                    name="register-form"
                    onFinish={onFinish}
                    layout="vertical"
                    className="register-form"
                    autoComplete="off"
                >
                    <Form.Item
                        name={fieldNames.username}
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
                        <Input
                            placeholder="Enter your username"
                            autoComplete="off"
                            data-lpignore="true"
                            data-form-type="other"
                        />
                    </Form.Item>

                    <Form.Item
                        name={fieldNames.password}
                        label="Password"
                        rules={[
                            { required: true, message: 'Please input your password!' },
                            { min: 8, message: 'Password must be at least 8 characters' },
                        ]}
                    >
                        <Input.Password
                            placeholder="Enter your password"
                            autoComplete="new-password"
                            data-lpignore="true"
                            data-form-type="other"
                        />
                    </Form.Item>

                    <Form.Item
                        name={fieldNames.bio}
                        label="Bio (Optional)"
                        rules={[
                            { max: 200, message: 'Bio cannot exceed 200 characters' },
                        ]}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Tell us about yourself"
                            autoComplete="off"
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

export default RegisterPage;