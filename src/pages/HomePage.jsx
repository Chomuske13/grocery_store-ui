import React, { useEffect, useState } from "react";
import { Typography, Button } from "antd";
import ProductsList from "../components/ProductList";
import CreateProductModal from "../components/CreateProductModal";
import EditProductModal from "../components/EditProductModal";

const { Title } = Typography;

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

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
        setIsCreateModalVisible(false);
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setIsEditModalVisible(true);
    };

    const handleUpdateProduct = (updatedProduct) => {
        setProducts((prevProducts) =>
            prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
        setIsEditModalVisible(false);
    };

    return (
        <div className="home-page">
            <Title level={2} className="page-title">Our Products</Title>
            <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                Create New Product
            </Button>
            <ProductsList products={products} loading={loading} onEdit={handleEditProduct} />
            <CreateProductModal
                visible={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                onCreate={handleCreateProduct}
            />
            {selectedProduct && (
                <EditProductModal
                    visible={isEditModalVisible}
                    product={selectedProduct}
                    onCancel={() => setIsEditModalVisible(false)}
                    onUpdate={handleUpdateProduct}
                />
            )}
        </div>
    );
};

export default HomePage;
