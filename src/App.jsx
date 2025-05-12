import React from 'react';
import { Layout } from 'antd';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar.jsx';
import './App.css';

const { Content, Footer } = Layout;

function App() {
    return (
        <Layout className="app-layout">
            <Navbar />
            <Content className="app-content">
                <HomePage />
            </Content>
            <Footer className="app-footer">
                ©{new Date().getFullYear()} Продуктовый магазин
            </Footer>
        </Layout>
    );
}

export default App;