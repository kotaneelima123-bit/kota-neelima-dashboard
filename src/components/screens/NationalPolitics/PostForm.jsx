import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Box,
    Alert,
    IconButton,
    Typography
} from '@mui/material';
import { Close } from '@mui/icons-material';

const PostForm = ({ open, onClose, post, categories, loading, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        hindiTitle: '',
        teluguTitle: '',
        date: '',
        categoryId: '',
        image: null
    });
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title || '',
                hindiTitle: post.hindiTitle || '',
                teluguTitle: post.teluguTitle || '',
                date: post.date || '',
                categoryId: post.categoryId || '',
                image: null
            });
            setImagePreview(post.image || null);
        } else {
            setFormData({
                title: '',
                hindiTitle: '',
                teluguTitle: '',
                date: '',
                categoryId: '',
                image: null
            });
            setImagePreview(null);
        }
        setErrors({});
    }, [post, open]);

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
        if (!formData.categoryId) newErrors.categoryId = 'Category is required';
        if (!post && !formData.image) newErrors.image = 'Image is required';
        if (!formData.date) newErrors.date = 'Date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('hindiTitle', formData.hindiTitle);
            submitData.append('teluguTitle', formData.teluguTitle);
            submitData.append('date', formData.date);
            submitData.append('categoryId', formData.categoryId);
            if (formData.image) {
                submitData.append('image', formData.image);
            }

            onSubmit(submitData);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">
                        {post ? 'Edit Post' : 'Create New Post'}
                    </Typography>
                    <IconButton onClick={onClose} disabled={loading}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {categories.length === 0 && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            You need to create categories first before adding posts.
                        </Alert>
                    )}

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

                    <TextField
                        name="categoryId"
                        select
                        label="Category *"
                        value={formData.categoryId}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        error={!!errors.categoryId}
                        helperText={errors.categoryId}
                        disabled={loading || categories.length === 0}
                    >
                        <MenuItem value="">
                            <em>Select a category</em>
                        </MenuItem>
                        {categories.map((category) => (
                            <MenuItem key={category._id} value={category._id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </TextField>

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
                        disabled={loading || categories.length === 0}
                    >
                        {loading ? 'Saving...' : (post ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default PostForm;