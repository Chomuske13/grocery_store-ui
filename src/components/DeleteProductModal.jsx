import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';

const DeleteProductModal = ({ product, visible, onCancel, onDelete }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/products/${product.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete product');

            message.success('Product deleted successfully');
            onDelete(product.id); // Это вызовет handleDeleteProduct в HomePage
            onCancel();
        } catch (error) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={visible}
            title="Confirm Delete"
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    danger
                    loading={loading}
                    onClick={handleDelete}
                >
                    Delete
                </Button>,
            ]}
        >
            <p>Are you sure you want to delete "{product.name}"?</p>
            <p>This action cannot be undone.</p>
        </Modal>
    );
};

export default DeleteProductModal;