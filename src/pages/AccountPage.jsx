import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, message, Space, Typography } from 'antd';
import { ShoppingCartOutlined, LogoutOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import EditAccountModal from '../components/EditAccountModal';
import './AccountPage.css';
import DeleteAccountModal from '../components/DeleteAccountModal';

const { Title, Text: AntdText } = Typography;

export const AccountPage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
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

    const handleDeleteSuccess = () => {
        setDeleteModalVisible(false);
        navigate('/');
        message.success('Your account has been deleted successfully');
    };

    const handleUpdateAccount = async (values) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/users/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: values.username,
                    password: values.password,
                    bio: values.bio
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update account');
            }

            const updatedUser = await response.json();
            setUserData(updatedUser);
            message.success('Account updated successfully');
        } catch (error) {
            console.error('Update error:', error);
            message.error(error.message);
        } finally {
            setLoading(false);
        }
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

                <Space direction="vertical" style={{ width: '100%', marginTop: 24 }}>
                    <Button
                        type="default"
                        icon={<ShoppingCartOutlined />}
                        onClick={goToUserProducts}
                        block
                    >
                        View My Products
                    </Button>
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => setEditModalVisible(true)}
                        block
                    >
                        Edit Account
                    </Button>
                    <Button
                        danger
                        type="default"
                        icon={<DeleteOutlined />}
                        onClick={() => setDeleteModalVisible(true)}
                        block
                    >
                        Delete Account
                    </Button>
                    <Button
                        type="primary"
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        block
                        className="logout-button"
                    >
                        Log Out
                    </Button>
                </Space>
            </Card>

            <EditAccountModal
                visible={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                userData={userData}
                onSave={handleUpdateAccount}
            />

            <DeleteAccountModal
                userId={id}
                visible={deleteModalVisible}
                onCancel={() => setDeleteModalVisible(false)}
                onSuccess={handleDeleteSuccess}
            />
        </div>
    );
};

export default AccountPage;