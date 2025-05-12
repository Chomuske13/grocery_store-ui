import React from 'react';
import { Button, Space } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

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
                    <Button type="text" className="nav-btn">Войти</Button>
                    <Button type="primary" className="nav-btn">Регистрация</Button>
                </Space>
            </div>
        </nav>
    );
};

export default Navbar;