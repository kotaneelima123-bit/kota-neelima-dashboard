import apiClient from './apiClient';

const NATIONAL_POLITICS_ENDPOINT = import.meta.env.VITE_NATIONAL_POLITICS_ENDPOINT;

export const getCategories = async () => {
    try {
        const response = await apiClient.get(`${NATIONAL_POLITICS_ENDPOINT}/categories`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createCategory = async (categoryData) => {
    try {
        const response = await apiClient.post(`${NATIONAL_POLITICS_ENDPOINT}/categories`, categoryData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteCategory = async (categoryId) => {
    try {
        const response = await apiClient.delete(`${NATIONAL_POLITICS_ENDPOINT}/categories/${categoryId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCategory = async (categoryId, categoryData) => {
    try {
        const response = await apiClient.put(`${NATIONAL_POLITICS_ENDPOINT}/update/category/${categoryId}`, categoryData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPosts = async () => {
    try {
        const response = await apiClient.get(`${NATIONAL_POLITICS_ENDPOINT}/gallery`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createPost = async (postData) => {
    try {
        const response = await apiClient.post(`${NATIONAL_POLITICS_ENDPOINT}/gallery`, postData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updatePost = async (postId, postData) => {
    try {
        const response = await apiClient.put(`${NATIONAL_POLITICS_ENDPOINT}/gallery/${postId}`, postData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deletePost = async (postId) => {
    try {
        const response = await apiClient.delete(`${NATIONAL_POLITICS_ENDPOINT}/gallery/${postId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};