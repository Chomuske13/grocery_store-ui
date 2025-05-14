import React from 'react';
import { Button, Space } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('userId') !== null;

    return (
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
    );
};

export default Navbar;
