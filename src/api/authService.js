import apiClient from './apiClient';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

export const loginUser = async (credentials) => {
    try {
        const response = await apiClient.post('/api/admin/login', credentials);
        showSuccessToast('Login successful!');
        return response;
    } catch (error) {
        throw new Error(error.message || 'Login failed');
    }
};

export const logoutUser = () => {
    localStorage.removeItem('authToken');
    showSuccessToast('Logged out successfully!');
};