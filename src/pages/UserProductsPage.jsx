import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { List, Button, Tag, Space, message, Typography, Popconfirm } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import './UserProductsPage.css';

const { Title, Text: AntdText } = Typography;

export const UserProductsPage = ({ refreshKey, onProductRemoved }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProducts = async () => {
            setLoading(true);
            try {
                const userResponse = await fetch(`http://localhost:8080/users/${id}`);
                if (!userResponse.ok) throw new Error('Failed to fetch user data');

                const userData = await userResponse.json();

                const productsResponse = await fetch(
                    `http://localhost:8080/products/by-user?userUsername=${userData.username}`
                );
                if (!productsResponse.ok) throw new Error('Failed to fetch products');

                const productsData = await productsResponse.json();
                setProducts(productsData);
            } catch (error) {
                message.error(error.message);
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProducts();
    }, [id, navigate, refreshKey]);

    const handleRemoveProduct = async (productId) => {
        try {
            const response = await fetch(`http://localhost:8080/products/${productId}/users/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to remove product');
            }

            message.success('Product removed successfully');

            // Update the local state to remove the deleted product
            setProducts(products.filter(product => product.id !== productId));

            // Notify parent component if needed
            if (onProductRemoved) {
                onProductRemoved();
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    return (
        <div className="user-products-container">
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{ marginBottom: 16 }}
            >
                Back to Account
            </Button>

            <Title level={3} style={{ marginBottom: 24 }}>
                My Products
            </Title>

            {loading ? (
                <div>Loading products...</div>
            ) : (
                <List
                    itemLayout="vertical"
                    dataSource={products}
                    renderItem={product => (
                        <List.Item
                            actions={[
                                <Popconfirm
                                    title="Are you sure you want to remove this product?"
                                    onConfirm={() => handleRemoveProduct(product.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                    >
                                        Remove
                                    </Button>
                                </Popconfirm>
                            ]}
                        >
                            <List.Item.Meta
                                title={product.name}
                                description={
                                    <Space direction="vertical" size={4}>
                                        <AntdText>Price: ${product.price}</AntdText>
                                        <Tag color="blue">{product.category}</Tag>
                                    </Space>
                                }
                            />
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
};

export default UserProductsPage;