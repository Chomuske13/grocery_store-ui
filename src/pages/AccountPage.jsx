import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, message, Space, Typography } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import './AccountPage.css';

const { Title, Text: AntdText } = Typography; // Аналогичное переименование

export const AccountPage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8080/users/${id}`);
                if (!response.ok) throw new Error('Failed to fetch user data');

                const data = await response.json();
                setUserData(data);
            } catch (error) {
                message.error(error.message);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/');
        message.success('Logged out successfully');
    };

    const goToUserProducts = () => {
        navigate(`/users/${id}/products`);
    };

    if (loading || !userData) {
        return <div>Loading user data...</div>;
    }

    return (
        <div className="account-container">
            <Card className="account-card">
                <Title level={2} className="account-title">
                    Your Account
                </Title>

                <div className="account-info">
                    <AntdText strong>Username:</AntdText>
                    <AntdText>{userData.username}</AntdText>

                    <AntdText strong style={{ marginTop: 16 }}>Bio:</AntdText>
                    <AntdText>{userData.bio || 'No bio provided'}</AntdText>
                </div>

                <Space style={{ marginTop: 24 }}>
                    <Button
                        type="primary"
                        onClick={handleLogout}
                        className="logout-button"
                    >
                        Log Out
                    </Button>
                    <Button
                        type="default"
                        icon={<ShoppingCartOutlined />}
                        onClick={goToUserProducts}
                    >
                        View My Products
                    </Button>
                </Space>
            </Card>
        </div>
    );
};

export default AccountPage;