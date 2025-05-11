import React from 'react';
import './ProductCard.css';
import { Card } from 'antd';

const ProductCard = ({ product }) => {
    return (
        <Card
            hoverable
            className="product-card"
            cover={
                <div className="product-image">
                    <span>Product Image</span>
                </div>
            }
        >
            <h3>{product.name}</h3>
            <div className="product-price">${product.price}</div>
            <div className="product-category">{product.category}</div>
        </Card>
    );
};

export default ProductCard;