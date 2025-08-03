import apiClient from './apiClient';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

const GALLERY_ENDPOINT = import.meta.env.VITE_GALLERY_ENDPOINT;

export const getGalleryItems = async () => {
    try {
        const response = await apiClient.get(`${GALLERY_ENDPOINT}/posts`);
        return response;
    } catch (error) {
        throw error; // Error is already handled by interceptor
    }
};

export const createGalleryItem = async (formData) => {
    try {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                data.append(key, value);
            }
        });

        const response = await apiClient.post(`${GALLERY_ENDPOINT}/create/post`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        showSuccessToast('Gallery item created successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateGalleryItem = async (_id, formData) => {
    try {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                data.append(key, value);
            }
        });

        const response = await apiClient.put(`${GALLERY_ENDPOINT}/update/post/${_id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        showSuccessToast('Gallery item updated successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteGalleryItem = async (_id) => {
    try {
        const response = await apiClient.delete(`${GALLERY_ENDPOINT}/delete/post/${_id}`);
        showSuccessToast('Gallery item deleted successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};