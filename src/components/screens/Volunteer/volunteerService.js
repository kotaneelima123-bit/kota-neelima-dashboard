// src/services/volunteerService.js
import apiClient from '../../../api/apiClient';

const volunteerService = {
    // Get all volunteers
    getAllVolunteers: async () => {
        try {
            const response = await apiClient.get('/api/volunteer/all');
            return response; // apiClient already returns response.data
        } catch (error) {
            throw error;
        }
    },

    // Get volunteer by ID
    getVolunteerById: async (id) => {
        try {
            const response = await apiClient.get(`/api/volunteer/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Update volunteer
    updateVolunteer: async (id, data) => {
        try {
            const response = await apiClient.put(`/api/volunteer/update/${id}`, data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Delete volunteer
    deleteVolunteer: async (id) => {
        try {
            const response = await apiClient.delete(`/api/volunteer/delete/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default volunteerService;