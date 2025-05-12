import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import './App.css';
import AccountPage from "./pages/AccountPage.jsx";
import UserProductsPage from './pages/UserProductsPage';

const { Content, Footer } = Layout;

function App() {
    return (
        <Router>
            <Layout className="app-layout">
                <Navbar />
                <Content className="app-content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/account/:id" element={<AccountPage />} />
                        <Route path="/users/:id/products" element={<UserProductsPage />} />
                    </Routes>
                </Content>
                <Footer className="app-footer">
                    ©{new Date().getFullYear()} Продуктовый магазин
                </Footer>
            </Layout>
        </Router>
    );
}

export default App;