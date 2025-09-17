import apiClient from './apiClient';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

// const JOURNALISM_ENDPOINT = import.meta.env.VITE_JOURNALISM_ENDPOINT;

export const getPressItems = async () => {
    try {
        const response = await apiClient.get(`/profile/articles/all`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const createPressItem = async (itemData) => {
    try {
        const response = await apiClient.post(`/profile/articles/create`, itemData);
        showSuccessToast('Press item created successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const updatePressItem = async (_id, itemData) => {
    try {
        const response = await apiClient.put(`/profile/articles/${_id}`, itemData);
        showSuccessToast('Press item updated successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const deletePressItem = async (_id) => {
    try {
        const response = await apiClient.delete(`/profile/articles/${_id}`);
        showSuccessToast('Press item deleted successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};


// photos


export const getPhotoItems = async () => {
    try {
        const response = await apiClient.get(`/profile/photos/all`);
        return response;
    } catch (error) {
        throw error; // Error is already handled by interceptor
    }
};

export const createPhotoItem = async (formData) => {
    try {

        const response = await apiClient.post(`/profile/photos/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Photo item created successfully:', response.data);

        showSuccessToast('Photo item created successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const deletePhotoItem = async (_id) => {
    try {
        const response = await apiClient.delete(`/profile/photos/${_id}`);
        showSuccessToast('Photo item deleted successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};


// bio

export const getBioItem = async () => {
    try {
        const response = await apiClient.get(`/profile/bio/all`);
        return response;
    } catch (error) {
        throw error; // Error is already handled by interceptor
    }
};

export const createBioItem = async (formData) => {
    try {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                data.append(key, value);
            }
        });

        const response = await apiClient.post(`/profile/bio/create`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Bio created successfully:', response.data);

        showSuccessToast('Bio created successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateBioItem = async (_id, formData) => {
    try {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                data.append(key, value);
            }
        });

        const response = await apiClient.put(`/profile/bio/${_id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        showSuccessToast('Bio updated successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteBioItem = async (_id) => {
    try {
        const response = await apiClient.delete(`/profile/bio/${_id}`);
        showSuccessToast('Bio deleted successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};
