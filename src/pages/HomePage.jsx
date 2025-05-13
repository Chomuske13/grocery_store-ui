import React, { useEffect, useState } from "react";
import { Typography, Button } from "antd";
import ProductsList from "../components/ProductList";
import CreateProductModal from "../components/CreateProductModal";

const { Title } = Typography;

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

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

    const handleCreateProduct = (newProduct) => {
        setProducts((prevProducts) => [...prevProducts, newProduct]);
        setIsModalVisible(false);//проверить!!!!!!!!!!!!!!!!
    };

    return (
        <div className="home-page">
            <Title level={2} className="page-title">
                Our Products
            </Title>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Create New Product
            </Button>
            <ProductsList products={products} loading={loading} />
            <CreateProductModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onCreate={handleCreateProduct} // Передаем функцию добавления
            />
        </div>
    );
};

export default HomePage;
