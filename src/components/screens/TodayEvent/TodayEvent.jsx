import React, { useState, useEffect } from 'react';
import {
    Box,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Chip,
    Typography,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import TodayEventForm from './TodayEventForm';
import TodayEventTable from './TodayEventTable';
import * as todayEventService from '../../../api/todayEventService';

const TodayEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        hindiTitle: '',
        teluguTitle: '',
        description: '',
        hindiDescription: '',
        teluguDescription: '',
        youtubeUrl: '',
        articleUrl: '',
        date: '',
        image: null
    });
    const [currentItem, setCurrentItem] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [confirmDialog, setConfirmDialog] = useState({ open: false });
    const [formOpen, setFormOpen] = useState(false);
    const [processingFeatured, setProcessingFeatured] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const data = await todayEventService.getEvents();
            setEvents(data || []);
        } catch (error) {
            showSnackbar('Error fetching events', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            if (currentItem) {
                await todayEventService.updateEvent(currentItem._id, formData);
                showSnackbar('Event updated successfully');
            } else {
                await todayEventService.createEvent(formData);
                showSnackbar('Event created successfully');
            }
            await fetchEvents();
            handleCloseForm();
        } catch (error) {
            showSnackbar('Error saving event', 'error');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await todayEventService.deleteEvent(id);
            await fetchEvents();
            showSnackbar('Event deleted successfully');
        } catch (error) {
            showSnackbar('Error deleting event', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFeatured = async (id, currentFeaturedStatus, status) => {
        if (status !== 'active') {
            showSnackbar('Only active events can be featured', 'warning');
            return;
        }

        // Check if trying to feature an event when another is already featured
        const featuredEvents = events.filter(event => event.featured && event._id !== id);
        if (!currentFeaturedStatus && featuredEvents.length > 0) {
            showSnackbar(`You already have a featured post (${featuredEvents[0].title}). Please unfeature it first.`, 'warning');
            return;
        }

        setProcessingFeatured(true);
        try {
            await todayEventService.toggleFeaturedEvent(id, currentFeaturedStatus);
            showSnackbar(`Event ${currentFeaturedStatus ? 'unfeatured' : 'featured'} successfully`);
            await fetchEvents();
        } catch (error) {
            showSnackbar('Error updating featured status', 'error');
        } finally {
            setProcessingFeatured(false);
        }
    };

    const handleEdit = (event) => {
        setCurrentItem(event);
        setFormData({
            title: event.title || '',
            hindiTitle: event.hindiTitle || '',
            teluguTitle: event.teluguTitle || '',
            description: event.description || '',
            hindiDescription: event.hindiDescription || '',
            teluguDescription: event.teluguDescription || '',
            youtubeUrl: event.youtubeUrl || '',
            articleUrl: event.articleUrl || '',
            date: event.date || '',
            image: null
        });
        setFormOpen(true);
    };

    const handleAddNew = () => {
        setCurrentItem(null);
        setFormData({
            title: '',
            hindiTitle: '',
            teluguTitle: '',
            description: '',
            hindiDescription: '',
            teluguDescription: '',
            youtubeUrl: '',
            articleUrl: '',
            date: '',
            image: null
        });
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setCurrentItem(null);
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                p: 2,
                backgroundColor: 'grey.50',
                borderRadius: 1
            }}>
                <Typography variant="h5" component="h1">
                    Today's Events
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleAddNew}
                    startIcon={<AddIcon />}
                >
                    Add New Event
                </Button>
            </Box>

            <TodayEventTable
                data={events}
                loading={loading || processingFeatured}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRefresh={fetchEvents}
                onToggleFeatured={handleToggleFeatured}
            />

            <TodayEventForm
                open={formOpen}
                onClose={handleCloseForm}
                event={currentItem}
                formData={formData}
                setFormData={setFormData}
                loading={formLoading}
                onSubmit={handleSubmit}
            />

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default TodayEvent;