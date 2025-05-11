import React from 'react';
import { Layout } from 'antd';
import HomePage from './pages/HomePage';
import './App.css';

const { Content, Footer } = Layout;

function App() {
    return (
        <Layout className="app-layout">
            <Content className="app-content">
                <HomePage />
            </Content>
            <Footer className="app-footer">
                ©{new Date().getFullYear()}
            </Footer>
        </Layout>
    );
}

export default App;