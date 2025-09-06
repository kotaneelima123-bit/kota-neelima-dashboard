import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    IconButton,
    Typography
} from '@mui/material';
import { Close } from '@mui/icons-material';

const TodayEventForm = ({ open, onClose, event, formData, setFormData, loading, onSubmit }) => {
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(event?.image || null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.date) newErrors.date = 'Date is required';
        // if (!event && !formData.image) newErrors.image = 'Image is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(e);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">
                        {event ? 'Edit Event' : 'Create New Event'}
                    </Typography>
                    <IconButton onClick={onClose} disabled={loading}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        name="title"
                        label="Title *"
                        value={formData.title}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        error={!!errors.title}
                        helperText={errors.title}
                        disabled={loading}
                    />

                    <TextField
                        name="hindiTitle"
                        label="Hindi Title"
                        value={formData.hindiTitle}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        disabled={loading}
                    />

                    <TextField
                        name="teluguTitle"
                        label="Telugu Title"
                        value={formData.teluguTitle}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        disabled={loading}
                    />

                    <TextField
                        name="description"
                        label="Description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                        disabled={loading}
                    />

                    <TextField
                        name="hindiDescription"
                        label="Hindi Description"
                        value={formData.hindiDescription}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                        disabled={loading}
                    />

                    <TextField
                        name="teluguDescription"
                        label="Telugu Description"
                        value={formData.teluguDescription}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                        disabled={loading}
                    />

                    <TextField
                        name="youtubeUrl"
                        label="YouTube URL"
                        value={formData.youtubeUrl}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        disabled={loading}
                    />

                    <TextField
                        name="articleUrl"
                        label="Article URL"
                        value={formData.articleUrl}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        disabled={loading}
                    />

                    <TextField
                        name="date"
                        label="Date *"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.date}
                        helperText={errors.date}
                        disabled={loading}
                    />

                    <Box sx={{ mt: 2 }}>
                        <Button
                            variant="outlined"
                            component="label"
                            disabled={loading}
                        >
                            Upload Image *
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Button>
                        {errors.image && (
                            <Typography color="error" variant="caption" display="block">
                                {errors.image}
                            </Typography>
                        )}

                        {imagePreview && (
                            <Box sx={{ mt: 2 }}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                                />
                            </Box>
                        )}
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (event ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TodayEventForm;