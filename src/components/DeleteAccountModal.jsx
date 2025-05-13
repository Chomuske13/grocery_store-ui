import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const DeleteAccountModal = ({ userId, visible, onCancel, onSuccess }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            message.loading('Deleting account...', 0);

            const response = await fetch(`http://localhost:8080/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 204) {
                message.success('Account deleted successfully');
                localStorage.removeItem('userId');
                onSuccess();
                return;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to delete account');
            }
        } catch (error) {
            console.error('Delete error:', error);
            message.error(error.message);
        } finally {
            setLoading(false);
            message.destroy();
        }
    };

    return (
        <Modal
            open={visible}
            title={
                <>
                    <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                    Confirm Account Deletion
                </>
            }
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    key="delete"
                    type="primary"
                    danger
                    loading={loading}
                    onClick={handleDelete}
                >
                    Delete Account
                </Button>,
            ]}
            centered
        >
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <p>All your data will be permanently deleted.</p>
        </Modal>
    );
};

export default DeleteAccountModal;