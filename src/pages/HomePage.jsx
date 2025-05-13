import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import ProductsList from '../components/ProductList';
const { Title } = Typography;

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="home-page" >
            <Title level={2} className="page-title">
                Our Products
            </Title>
            <ProductsList products={products} loading={loading} />
        </div>
    );
};

export default HomePage;