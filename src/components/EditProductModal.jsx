
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const EditProductModal = ({ product, visible, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [isTypingNewCategory, setIsTypingNewCategory] = useState(false);
    const selectRef = useRef(null);

    useEffect(() => {
        if (visible) {
            fetchCategories();
            form.setFieldsValue({
                name: product.name,
                price: product.price,
                categoryId: product.category?.id || product.category,
            });
            setSearchValue(product.category?.name || '');
            setIsTypingNewCategory(false);
        }
    }, [visible, product]);

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

            // Если пользователь ввел новую категорию
            if (isTypingNewCategory && searchValue) {
                const categoryResponse = await fetch('http://localhost:8080/categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: searchValue }),
                });

                if (!categoryResponse.ok) throw new Error('Failed to create category');
                const newCategory = await categoryResponse.json();
                categoryId = newCategory.id;
            }

            // Обновляем продукт
            const productResponse = await fetch(`http://localhost:8080/products/${product.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name,
                    price: values.price,
                    categoryId: categoryId,
                }),
            });

            if (!productResponse.ok) throw new Error('Failed to update product');

            const updatedProduct = await productResponse.json();
            message.success('Product updated successfully');
            onUpdate(updatedProduct);
            form.resetFields();
            setSearchValue('');
            setIsTypingNewCategory(false);
            onCancel();
        } catch (error) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearchValue(value);
        setIsTypingNewCategory(true);
    };

    const handleSelect = (value, option) => {
        if (value === 'create_new') {
            setIsTypingNewCategory(true);
        } else {
            setSearchValue(option.children);
            setIsTypingNewCategory(false);
        }
    };

    const handleSelectFocus = () => {
        if (selectRef.current) {
            selectRef.current.focus();
        }
    };

    const filterOption = (input, option) => {
        if (option.value === 'create_new') return true;
        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    return (
        <Modal
            open={visible}
            title="Edit Product"
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
                    Save Changes
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
                        value={isTypingNewCategory ? undefined : searchValue}
                        onSearch={handleSearch}
                        onChange={handleSelect}
                        onFocus={handleSelectFocus}
                        filterOption={filterOption}
                        style={{ width: '100%' }}
                        dropdownMatchSelectWidth={false}
                    >
                        {searchValue && !categories.some(c => c.name.toLowerCase() === searchValue.toLowerCase()) && (
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

                <Form.Item name="categoryName" noStyle>
                    <Input type="hidden" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditProductModal;