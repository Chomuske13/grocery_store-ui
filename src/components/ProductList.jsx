import React from 'react';
import './ProductList.css';
import { Row, Col, Spin } from 'antd';
import ProductCard from './ProductCard';

const ProductsList = ({ products, loading, onUpdate, onDelete }) => {
    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Row gutter={[16, 16]} className="products-container">
            {products.map((product) => (
                <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                    <ProductCard product={product}
                                 onUpdate={onUpdate}
                                 onDelete={onDelete}
                    />
                </Col>
            ))}
        </Row>
    );
};

export default ProductsList;