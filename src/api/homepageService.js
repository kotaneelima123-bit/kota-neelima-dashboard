import apiClient from './apiClient';

export const setHomepageGallery = async (galleryItemIds) => {
    try {
        const response = await apiClient.post('/api/admin/set', {
            galleryItems: galleryItemIds
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getHomepageGallery = async () => {
    try {
        const response = await apiClient.get('/api/admin/get');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const setHomepageArticle = async (articleItemIds) => {
    try {
        const response = await apiClient.post('/api/admin/article/set', {
            articleItems: articleItemIds
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getHomepageArticle = async () => {
    try {
        const response = await apiClient.get('/api/admin/article/get');
        return response.data;
    } catch (error) {
        throw error;
    }
};