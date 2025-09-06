import apiClient from './apiClient';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

const POLICY_ENDPOINT = import.meta.env.VITE_POLICY_ENDPOINT;

export const getArticleItems = async () => {
    try {
        const response = await apiClient.get(`${POLICY_ENDPOINT}/all`);
        console.log('Fetched article items:', response.data);
        return response;
    } catch (error) {
        throw error; // Error is already handled by interceptor
    }
};

export const createArticleItem = async (articleData) => {
    try {
        // Remove any null or undefined values from the payload
        const cleanedData = Object.fromEntries(
            Object.entries(articleData).filter(([_, value]) =>
                value !== null && value !== undefined && value !== ''
            )
        );

        const response = await apiClient.post(`${POLICY_ENDPOINT}/post`, cleanedData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        showSuccessToast('Article item created successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateArticleItem = async (_id, articleData) => {
    try {
        // Remove any null or undefined values from the payload
        const cleanedData = Object.fromEntries(
            Object.entries(articleData).filter(([_, value]) =>
                value !== null && value !== undefined && value !== ''
            )
        );

        const response = await apiClient.put(`${POLICY_ENDPOINT}/update/${_id}`, cleanedData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        showSuccessToast('Article item updated successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteArticleItem = async (_id) => {
    try {
        const response = await apiClient.delete(`${POLICY_ENDPOINT}/delete/${_id}`);
        showSuccessToast('Article item deleted successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};