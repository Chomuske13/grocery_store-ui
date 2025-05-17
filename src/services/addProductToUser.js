// src/services/addProductToUser.js
import { message } from 'antd';

import { notification } from "antd";

export const addProductToUser = async (productId) => {
    try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            throw new Error("User not authenticated");
        }

        const response = await fetch(`http://localhost:8080/products/${productId}/users/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to add product");
        }

        const data = await response.json();

        // Уведомление с кастомным временем отображения
        notification.success({
            message: "Product added successfully!",
            description: `The product has been added to your account.`,
            duration: 3, // Время показа уведомления (в секундах)
        });

        return data;
    } catch (error) {
        message.error(error.message);
        throw error;
    }
};
