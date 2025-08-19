import apiClient from './apiClient';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

const HAKKU_ENDPOINT = import.meta.env.VITE_HAKKU_ENDPOINT;

export const getPressItems = async () => {
    try {
        const response = await apiClient.get(`${HAKKU_ENDPOINT}/press-release/all`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const createPressItem = async (itemData) => {
    try {
        const response = await apiClient.post(`${HAKKU_ENDPOINT}/press-release/create`, itemData);
        showSuccessToast('Press item created successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const updatePressItem = async (_id, itemData) => {
    try {
        const response = await apiClient.put(`${HAKKU_ENDPOINT}/press-release/update/${_id}`, itemData);
        showSuccessToast('Press item updated successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const deletePressItem = async (_id) => {
    try {
        const response = await apiClient.delete(`${HAKKU_ENDPOINT}/press-release/delete/${_id}`);
        showSuccessToast('Press item deleted successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};