import apiClient from './apiClient';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

const PRESS_ENDPOINT = import.meta.env.VITE_PRESS_ENDPOINT;

export const getPressItems = async () => {
    try {
        const response = await apiClient.get(`${PRESS_ENDPOINT}/posts`);
        return response;
    } catch (error) {
        throw error; // Error is already handled by interceptor
    }
};

export const createPressItem = async (formData) => {
    try {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                data.append(key, value);
            }
        });

        const response = await apiClient.post(`${PRESS_ENDPOINT}/create/post`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Press item created successfully:', response.data);

        showSuccessToast('Press item created successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const updatePressItem = async (_id, formData) => {
    try {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                data.append(key, value);
            }
        });

        const response = await apiClient.put(`${PRESS_ENDPOINT}/update/post/${_id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        showSuccessToast('Press item updated successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const deletePressItem = async (_id) => {
    try {
        const response = await apiClient.delete(`${PRESS_ENDPOINT}/delete/post/${_id}`);
        showSuccessToast('Press item deleted successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};