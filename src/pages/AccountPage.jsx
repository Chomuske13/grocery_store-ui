import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Typography, Button, message } from 'antd';
import './AccountPage.css';

const { Title, Text } = Typography;

export const AccountPage = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams(); // Получаем ID из URL

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/users/${id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUserData(data);
            } catch (error) {
                message.error(error.message);
                navigate('/login');
            }
        };

        fetchUserData();
    }, [id, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/');
        message.success('Logged out successfully');
    };

    // ... остальной код без изменений


    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="account-container">
            <Card className="account-card">
                <Title level={2} className="account-title">
                    Your Account
                </Title>

                <div className="account-info">
                    <Text strong>Username:</Text>
                    <Text>{userData.username}</Text>

                    <Text strong style={{ marginTop: 16 }}>Bio:</Text>
                    <Text>{userData.bio || 'No bio provided'}</Text>
                </div>

                <Button
                    type="primary"
                    onClick={handleLogout}
                    className="logout-button"
                >
                    Log Out
                </Button>
            </Card>
        </div>
    );
};

export default AccountPage;