import apiClient from './apiClient';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

const HAKKU_ENDPOINT = import.meta.env.VITE_HAKKU_ENDPOINT;

export const getVideoItems = async () => {
    try {
        const response = await apiClient.get(`${HAKKU_ENDPOINT}/all`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const createVideoItem = async (itemData) => {
    try {
        const response = await apiClient.post(`${HAKKU_ENDPOINT}/create`, itemData);
        showSuccessToast('Video item created successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateVideoItem = async (_id, itemData) => {
    try {
        const response = await apiClient.put(`${HAKKU_ENDPOINT}/update/${_id}`, itemData);
        showSuccessToast('Video item updated successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteVideoItem = async (_id) => {
    try {
        const response = await apiClient.delete(`${HAKKU_ENDPOINT}/delete/${_id}`);
        showSuccessToast('Video item deleted successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};