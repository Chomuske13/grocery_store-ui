import React, { useEffect, useState } from "react";
import { Typography, Button } from "antd";
import { useLocation } from "react-router-dom";
import ProductsList from "../components/ProductList";
import CreateProductModal from "../components/CreateProductModal";

const { Title } = Typography;

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const location = useLocation(); // 🔹 Получаем текущий URL

    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:8080/products");
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [location.pathname]); // 🔹 Обновляем данные при каждом заходе на страницу

    const handleCreateProduct = (newProduct) => {
        setProducts((prevProducts) => [...prevProducts, newProduct]);
        setIsModalVisible(false);
    };

    const handleUpdateProduct = (updatedProduct) => {
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === updatedProduct.id ? updatedProduct : product
            )
        );
    };

    const handleDeleteProduct = (productId) => {
        setProducts(prevProducts =>
            prevProducts.filter(product => product.id !== productId)
        );
    };

    return (
        <div className="home-page">
            <Title level={2} className="page-title">
                Our Products
            </Title>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Create New Product
            </Button>
            <ProductsList
                products={products}
                loading={loading}
                onUpdate={handleUpdateProduct}
                onDelete={handleDeleteProduct}
            />
            <CreateProductModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onCreate={handleCreateProduct}
            />
        </div>
    );
};

export default HomePage;
