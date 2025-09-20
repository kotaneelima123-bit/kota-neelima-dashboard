import apiClient from './apiClient';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

export const getArticleItems = async () => {
    try {
        const response = await apiClient.get(`/api/podcast/all`);
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

        const response = await apiClient.post(`/api/podcast/create`, cleanedData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        showSuccessToast('Podcast item created successfully!');
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

        const response = await apiClient.put(`/api/podcast/${_id}`, cleanedData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        showSuccessToast('Podcast item updated successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteArticleItem = async (_id) => {
    try {
        const response = await apiClient.delete(`/api/podcast/${_id}`);
        showSuccessToast('Podcast item deleted successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};