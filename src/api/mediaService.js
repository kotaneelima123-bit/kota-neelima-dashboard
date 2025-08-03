import apiClient from './apiClient';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

const MEDIA_ENDPOINT = import.meta.env.VITE_MEDIA_ENDPOINT;

export const getMediaItems = async () => {
    try {
        const response = await apiClient.get(`${MEDIA_ENDPOINT}/post`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const createMediaItem = async (itemData) => {
    try {
        const response = await apiClient.post(`${MEDIA_ENDPOINT}/post`, itemData);
        showSuccessToast('Media item created successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateMediaItem = async (_id, itemData) => {
    try {
        const response = await apiClient.put(`${MEDIA_ENDPOINT}/post/${_id}`, itemData);
        showSuccessToast('Media item updated successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteMediaItem = async (_id) => {
    try {
        const response = await apiClient.delete(`${MEDIA_ENDPOINT}/post/${_id}`);
        showSuccessToast('Media item deleted successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};