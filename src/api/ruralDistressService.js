import apiClient from './apiClient';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

const JOURNALISM_ENDPOINT = import.meta.env.VITE_JOURNALISM_ENDPOINT;

export const getArticleItems = async () => {
    try {
        const response = await apiClient.get(`/api/rural-distress/articles/all`);
        console.log('Fetched article items:', response.data);
        return response;
    } catch (error) {
        throw error; // Error is already handled by interceptor
    }
};

export const createArticleItem = async (articleData) => {
    try {
        // Remove any null or undefined values from the payload
        const cleanedData = Object.fromEntries(
            Object.entries(articleData).filter(([_, value]) =>
                value !== null && value !== undefined && value !== ''
            )
        );

        const response = await apiClient.post(`/api/rural-distress/article/create`, cleanedData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        showSuccessToast('Article item created successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateArticleItem = async (_id, articleData) => {
    try {
        // Remove any null or undefined values from the payload
        const cleanedData = Object.fromEntries(
            Object.entries(articleData).filter(([_, value]) =>
                value !== null && value !== undefined && value !== ''
            )
        );

        const response = await apiClient.put(`/api/rural-distress/article/${_id}`, cleanedData, {
            headers: {
                'Content-Type': 'application/json',
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
        const response = await apiClient.delete(`/api/rural-distress/article/${_id}`);
        showSuccessToast('Article item deleted successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};


// rural distress

export const getRuralDistressItems = async () => {
    try {
        const response = await apiClient.get(`/api/rural-distress/all`);
        console.log('Fetched article items:', response.data);
        return response;
    } catch (error) {
        throw error; // Error is already handled by interceptor
    }
};

export const createRuralDistressItem = async (articleData) => {
    try {
        // Remove any null or undefined values from the payload
        const cleanedData = Object.fromEntries(
            Object.entries(articleData).filter(([_, value]) =>
                value !== null && value !== undefined && value !== ''
            )
        );

        const response = await apiClient.post(`/api/rural-distress/create`, cleanedData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        showSuccessToast('Article item created successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateRuralDistressItem = async (_id, articleData) => {
    try {
        // Remove any null or undefined values from the payload
        const cleanedData = Object.fromEntries(
            Object.entries(articleData).filter(([_, value]) =>
                value !== null && value !== undefined && value !== ''
            )
        );

        const response = await apiClient.put(`/api/rural-distress/${_id}`, cleanedData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        showSuccessToast('Article item updated successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteRuralDistressItem = async (_id) => {
    try {
        const response = await apiClient.delete(`/api/rural-distress/${_id}`);
        showSuccessToast('Article item deleted successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

// photos


export const getPhotoItems = async () => {
    try {
        const response = await apiClient.get(`/api/rural-distress/photos/all`);
        return response;
    } catch (error) {
        throw error; // Error is already handled by interceptor
    }
};

export const createPhotoItem = async (formData) => {
    try {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                data.append(key, value);
            }
        });

        const response = await apiClient.post(`/api/rural-distress/photos/create`, data, {
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

export const updatePhotoItem = async (_id, formData) => {
    try {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                data.append(key, value);
            }
        });

        const response = await apiClient.put(`/api/rural-distress/photos/${_id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        showSuccessToast('Photo item updated successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const deletePhotoItem = async (_id) => {
    try {
        const response = await apiClient.delete(`/api/rural-distress/photos/${_id}`);
        showSuccessToast('Photo item deleted successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

// conferences

export const getConferenceItems = async () => {
    try {
        const response = await apiClient.get(`/api/rural-distress/conferences/all`);
        console.log('Fetched article items:', response.data);
        return response;
    } catch (error) {
        throw error; // Error is already handled by interceptor
    }
};

export const createConferenceItem = async (articleData) => {
    try {
        // Remove any null or undefined values from the payload
        const cleanedData = Object.fromEntries(
            Object.entries(articleData).filter(([_, value]) =>
                value !== null && value !== undefined && value !== ''
            )
        );

        const response = await apiClient.post(`/api/rural-distress/conferences/create`, cleanedData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        showSuccessToast('Conference item created successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateConferenceItem = async (_id, articleData) => {
    try {
        // Remove any null or undefined values from the payload
        const cleanedData = Object.fromEntries(
            Object.entries(articleData).filter(([_, value]) =>
                value !== null && value !== undefined && value !== ''
            )
        );

        const response = await apiClient.put(`/api/rural-distress/conferences/${_id}`, cleanedData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        showSuccessToast('Conference item updated successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteConferenceItem = async (_id) => {
    try {
        const response = await apiClient.delete(`/api/rural-distress/conferences/${_id}`);
        showSuccessToast('Conference item deleted successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};


// books

export const getBookItems = async () => {
    try {
        const response = await apiClient.get(`/api/rural-distress/books/all`);
        return response;
    } catch (error) {
        throw error; // Error is already handled by interceptor
    }
};

export const createBookItem = async (formData) => {
    try {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                data.append(key, value);
            }
        });

        const response = await apiClient.post(`/api/rural-distress/books/create`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Book item created successfully:', response.data);

        showSuccessToast('Book item created successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateBookItem = async (_id, formData) => {
    try {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                data.append(key, value);
            }
        });

        const response = await apiClient.put(`/api/rural-distress/books/${_id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        showSuccessToast('Book item updated successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteBookItem = async (_id) => {
    try {
        const response = await apiClient.delete(`/api/rural-distress/books/${_id}`);
        showSuccessToast('Book item deleted successfully!');
        return response;
    } catch (error) {
        throw error;
    }
};
