import apiClient from './apiClient';

export const getGalleryCategories = async () => {
    try {
        const response = await apiClient.get('/api/gallery-category/all');
        return response;
    } catch (error) {
        throw error;
    }
};

export const createGalleryCategory = async (categoryData) => {
    try {
        const response = await apiClient.post('/api/gallery-category/create', categoryData);
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateGalleryCategory = async (id, categoryData) => {
    try {
        const response = await apiClient.put(`/api/gallery-category/update/${id}`, categoryData);
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteGalleryCategory = async (id) => {
    try {
        const response = await apiClient.delete(`/api/gallery-category/delete/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};