import { Modal, message } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;

export const showDeleteConfirm = (userId, onSuccess) => {
    confirm({
        title: 'Are you sure you want to delete your account?',
        icon: <ExclamationCircleFilled />,
        content: 'This action cannot be undone. All your data will be permanently deleted.',
        okText: 'Yes, delete it',
        okType: 'danger',
        cancelText: 'No, keep it',
        async onOk() {
            try {
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
                message.destroy();
            }
        },
    });
};