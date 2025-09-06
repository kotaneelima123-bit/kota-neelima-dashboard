import apiClient from './apiClient';

const TODAY_EVENT = import.meta.env.VITE_TODAY_EVENT_ENDPOINT;

export const getEvents = async () => {
    try {
        const response = await apiClient.get(`${TODAY_EVENT}/all`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createEvent = async (eventData) => {
    try {
        const response = await apiClient.post(`${TODAY_EVENT}/create`, eventData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateEvent = async (eventId, eventData) => {
    try {
        const response = await apiClient.put(`${TODAY_EVENT}/${eventId}`, eventData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteEvent = async (eventId) => {
    try {
        const response = await apiClient.delete(`${TODAY_EVENT}/${eventId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};