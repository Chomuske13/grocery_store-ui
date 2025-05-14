import React, { useState } from 'react';
import './ProductCard.css';
import { Card, Button, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import EditProductModal from './EditProductModal';

const ProductCard = ({ product, onUpdate, onDelete }) => {
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);

    const handleEdit = () => {
        setIsEditModalVisible(true);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8080/products/${product.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete product');

            message.success('Product deleted successfully');
            onDelete(product.id);
        } catch (error) {
            message.error(error.message);
        } finally {
            setIsDeleteConfirmVisible(false);
        }
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
                    <Popconfirm
                        title="Are you sure to delete this product?"
                        open={isDeleteConfirmVisible}
                        onConfirm={handleDelete}
                        onCancel={() => setIsDeleteConfirmVisible(false)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => setIsDeleteConfirmVisible(true)}
                        />
                    </Popconfirm>
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
        </>
    );
};

export default ProductCard;