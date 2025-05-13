import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { HomeOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CreateProductModal from './CreateProductModal';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('userId') !== null;
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="nav-left">
                        <HomeOutlined
                            className="home-icon"
                            onClick={() => navigate('/')}
                        />
                        <span className="shop-title">Продуктовый магазин</span>
                    </div>
                    <Space className="nav-right">
                        {isLoggedIn && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setModalVisible(true)}
                                className="create-product-btn"
                            >
                                Create Product
                            </Button>
                        )}
                        {isLoggedIn ? (
                            <Button
                                type="text"
                                className="nav-btn"
                                icon={<UserOutlined />}
                                onClick={() => navigate(`/account/${localStorage.getItem('userId')}`)}
                            >
                                Account
                            </Button>
                        ) : (
                            <>
                                <Button
                                    type="text"
                                    className="nav-btn"
                                    onClick={() => navigate('/login')}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    type="primary"
                                    className="nav-btn"
                                    onClick={() => navigate('/register')}
                                >
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </Space>
                </div>
            </nav>

            <CreateProductModal
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onCreate={() => {
                    setModalVisible(false);
                    // Можно добавить обновление списка продуктов
                }}
            />
        </>
    );
};

export default Navbar;