import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const CreateProductModal = ({ visible, onCancel, onCreate }) => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const selectRef = useRef(null);

    useEffect(() => {
        if (visible) {
            fetchCategories();
        }
    }, [visible]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8080/categories');
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            let categoryId = values.categoryId;
            let categoryName = values.categoryName;

            // Если выбрана опция создания новой категории
            if (values.categoryId === 'create_new' && searchValue) {
                categoryName = searchValue;
                const categoryResponse = await fetch('http://localhost:8080/categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: categoryName }),
                });

                if (!categoryResponse.ok) throw new Error('Failed to create category');
                const newCategory = await categoryResponse.json();
                categoryId = newCategory.id;
            }

            // Создаем продукт
            const productResponse = await fetch('http://localhost:8080/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name,
                    price: values.price,
                    categoryId: categoryId,
                }),
            });

            if (!productResponse.ok) throw new Error('Failed to create product');

            const product = await productResponse.json();
            message.success('Product created successfully');
            console.log("Созданный продукт:", product);
            onCreate(product);
            form.resetFields();
            setSearchValue('');
        } catch (error) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleSelectFocus = () => {
        if (selectRef.current) {
            selectRef.current.focus();
        }
    };

    const dropdownRender = (menu) => (
        <div>
            <div style={{ padding: 8 }}>
                <Input
                    placeholder="Search or create category"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    allowClear
                />
            </div>
            {menu}
        </div>
    );

    return (
        <Modal
            open={visible}
            title="Create New Product"
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={handleSubmit}
                >
                    Create
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Product Name"
                    rules={[
                        { required: true, message: 'Please input product name!' },
                        { min: 2, message: 'Name must be at least 2 characters' },
                        { max: 100, message: 'Name must be at most 100 characters' },
                    ]}
                >
                    <Input placeholder="Enter product name" />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Price"
                    rules={[
                        { required: true, message: 'Please input price!' },
                        { type: 'number', min: 0.01, message: 'Price must be positive' },
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0.01}
                        step={0.01}
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    />
                </Form.Item>

                <Form.Item
                    name="categoryId"
                    label="Category"
                    rules={[{ required: true, message: 'Please select or create category!' }]}
                >
                    <Select
                        ref={selectRef}
                        showSearch
                        placeholder="Select or create category"
                        optionFilterProp="children"
                        onSearch={handleSearch}
                        onFocus={handleSelectFocus}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        dropdownRender={dropdownRender}
                        style={{ width: '100%' }}
                    >
                        {/* Опция создания новой категории - теперь в начале списка */}
                        {searchValue && (
                            <Option key="create_new" value="create_new">
                                <PlusOutlined /> Create "{searchValue}"
                            </Option>
                        )}
                        {categories.map(category => (
                            <Option key={category.id} value={category.id}>
                                {category.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Скрытое поле для хранения имени новой категории */}
                <Form.Item name="categoryName" noStyle>
                    <Input type="hidden" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateProductModal;