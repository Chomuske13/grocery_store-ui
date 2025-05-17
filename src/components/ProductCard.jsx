import React, { useState } from 'react';
import './ProductCard.css';
import { Card, Button } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import EditProductModal from './EditProductModal';
import DeleteProductModal from './DeleteProductModal';
import { addProductToUser } from '../services/addProductToUser';

const ProductCard = ({ product, onUpdate, onDelete, isAuthenticated }) => {
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [addingProduct, setAddingProduct] = useState(false);

    const handleEdit = () => {
        setIsEditModalVisible(true);
    };

    const handleDeleteClick = () => {
        setIsDeleteModalVisible(true);
    };

    const handleAddProduct = async () => {
        setAddingProduct(true);
        try {
            await addProductToUser(product.id);

            const storedProducts = JSON.parse(localStorage.getItem("userProducts")) || [];
            const updatedProducts = [...storedProducts, product];
            localStorage.setItem("userProducts", JSON.stringify(updatedProducts));

        } catch (error) {
            console.error('Error adding product:', error);
        } finally {
            setAddingProduct(false);
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
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={handleDeleteClick}
                    />,
                    isAuthenticated && (
                        <Button
                            type="text"
                            icon={<PlusOutlined />}
                            onClick={handleAddProduct}
                            loading={addingProduct}
                            disabled={addingProduct}
                        />
                    )
                ].filter(Boolean)} // Фильтруем null/undefined элементы
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