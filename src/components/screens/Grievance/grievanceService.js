// src/services/grievanceService.js
import apiClient from '../../../api/apiClient';

const grievanceService = {
    // Get all grievances
    getAllGrievances: async () => {
        try {
            const response = await apiClient.get('/api/grievances/all');
            return response; // apiClient already returns response.data
        } catch (error) {
            throw error;
        }
    },

    // Get grievance by ID
    getGrievanceById: async (id) => {
        try {
            const response = await apiClient.get(`/api/grievances/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Update grievance (supports file upload)
    updateGrievance: async (id, formData) => {
        try {
            const response = await apiClient.put(`/api/grievances/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Delete grievance
    deleteGrievance: async (id) => {
        try {
            const response = await apiClient.delete(`/api/grievances/delete/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default grievanceService;