import React, { useState } from 'react';
import './ProductCard.css';
import { Card, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import EditProductModal from './EditProductModal';
import DeleteProductModal from './DeleteProductModal';

const ProductCard = ({ product, onUpdate, onDelete }) => {
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    const handleEdit = () => {
        setIsEditModalVisible(true);
    };

    const handleDeleteClick = () => {
        setIsDeleteModalVisible(true);
    };

    return (
        <>
            <Card
                hoverable
                className="product-card"
                actions={[
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={handleEdit}
                    />,
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={handleDeleteClick}
                    />
                ]}
            >
                <h3>{product.name}</h3>
                <div className="product-price">${product.price}</div>
                <div className="product-category">{product.category?.name || product.category}</div>
            </Card>

            <EditProductModal
                product={product}
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                onUpdate={onUpdate}
            />

            <DeleteProductModal
                product={product}
                visible={isDeleteModalVisible}
                onCancel={() => setIsDeleteModalVisible(false)}
                onDelete={onDelete}
            />
        </>
    );
};

export default ProductCard;