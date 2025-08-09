import apiClient from './apiClient';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

const ARTICLE_ENDPOINT = import.meta.env.VITE_ARTICLE_ENDPOINT;

export const getArticleItems = async () => {
    try {
        const response = await apiClient.get(`${ARTICLE_ENDPOINT}/articles`);
        console.log('Fetched article items:', response.data);
        return response;
    } catch (error) {
        throw error; // Error is already handled by interceptor
    }
};

export const createArticleItem = async (formData) => {
    try {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                data.append(key, value);
            }
        });

        const response = await apiClient.post(`${ARTICLE_ENDPOINT}/create`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        showSuccessToast('Article item created successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateArticleItem = async (_id, formData) => {
    try {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                data.append(key, value);
            }
        });

        const response = await apiClient.put(`${ARTICLE_ENDPOINT}/${_id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
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
        const response = await apiClient.delete(`${ARTICLE_ENDPOINT}/${_id}`);
        showSuccessToast('Article item deleted successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};