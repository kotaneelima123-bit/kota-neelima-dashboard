import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Button,
    Box,
    Grid,
    Card,
    CardMedia,
    IconButton,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    Delete as DeleteIcon,
    CloudUpload as CloudUploadIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getPhotoItems, createPhotoItem, deletePhotoItem } from '../../../../api/profileService';

// Styled components
const PrimaryButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#75030F',
    color: 'white',
    borderRadius: '6px',
    padding: '8px 20px',
    fontWeight: '500',
    textTransform: 'none',
    fontSize: '0.9rem',
    '&:hover': {
        backgroundColor: '#5a020c',
    },
    '&:disabled': {
        backgroundColor: 'rgba(117, 3, 15, 0.5)',
    }
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
    color: '#75030F',
    borderColor: '#75030F',
    borderRadius: '6px',
    padding: '8px 20px',
    fontWeight: '500',
    textTransform: 'none',
    fontSize: '0.9rem',
    '&:hover': {
        borderColor: '#5a020c',
        backgroundColor: 'rgba(117, 3, 15, 0.04)'
    }
}));

const UploadButton = styled(Button)(({ theme }) => ({
    border: `1.5px dashed #75030F`,
    color: '#75030F',
    padding: '10px 20px',
    borderRadius: '6px',
    textTransform: 'none',
    fontWeight: '500',
    fontSize: '0.9rem',
    '&:hover': {
        border: `1.5px dashed #5a020c`,
        backgroundColor: 'rgba(117, 3, 15, 0.04)'
    }
}));

const PhotoCard = styled(Card)(({ theme }) => ({
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        '& .delete-button': {
            opacity: 1,
        }
    }
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    opacity: 0,
    transition: 'opacity 0.2s ease',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
    }
}));

const PhotosScreen = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [photoToDelete, setPhotoToDelete] = useState(null);

    // Fetch photos on component mount
    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        try {
            setLoading(true);
            const response = await getPhotoItems();
            if (response.data) {
                setPhotos(response.data);
            }
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch photos');
            setLoading(false);
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file (JPEG, PNG, etc.)');
                return;
            }

            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setError('Image size should be less than 10MB');
                return;
            }

            setSelectedImage(file);
            setError(''); // Clear any previous errors

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedImage) {
            setError('Please select an image to upload');
            return;
        }

        try {
            setUploading(true);
            setError('');

            // Create FormData with the correct field name "image"
            const formData = new FormData();
            formData.append('image', selectedImage);

            await createPhotoItem(formData);
            setSuccess('Photo uploaded successfully!');
            setUploadDialogOpen(false);
            setSelectedImage(null);
            setImagePreview('');
            fetchPhotos(); // Refresh photos list
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to upload photo. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const confirmDelete = (photo) => {
        setPhotoToDelete(photo);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await deletePhotoItem(photoToDelete._id);
            setSuccess('Photo deleted successfully!');
            setDeleteDialogOpen(false);
            setPhotoToDelete(null);
            fetchPhotos(); // Refresh photos list
        } catch (error) {
            setError('Failed to delete photo. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    const openUploadDialog = () => {
        setUploadDialogOpen(true);
        setError('');
        setSelectedImage(null);
        setImagePreview('');
    };

    const closeUploadDialog = () => {
        setUploadDialogOpen(false);
        setSelectedImage(null);
        setImagePreview('');
        setError('');
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setPhotoToDelete(null);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 600,
                        color: '#75030F'
                    }}
                >
                    Photos
                </Typography>
                <PrimaryButton
                    startIcon={<AddIcon />}
                    onClick={openUploadDialog}
                >
                    Upload Photo
                </PrimaryButton>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
                    {success}
                </Alert>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                    <CircularProgress sx={{ color: '#75030F' }} />
                </Box>
            ) : (
                <>
                    {photos.length === 0 ? (
                        <Box textAlign="center" py={8}>
                            <CloudUploadIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                No photos uploaded yet
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                                Upload high-quality photos to showcase on your website
                            </Typography>
                            <PrimaryButton
                                startIcon={<AddIcon />}
                                onClick={openUploadDialog}
                            >
                                Upload Your First Photo
                            </PrimaryButton>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {photos.map((photo) => (
                                <Grid item xs={12} sm={6} md={4} key={photo._id}>
                                    <PhotoCard>
                                        <CardMedia
                                            component="img"
                                            height="280"
                                            image={photo.image || '/placeholder-image.png'}
                                            alt="Uploaded photo"
                                            sx={{ objectFit: 'cover' }}
                                        />
                                        <DeleteButton
                                            className="delete-button"
                                            onClick={() => confirmDelete(photo)}
                                            size="small"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </DeleteButton>
                                    </PhotoCard>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </>
            )}

            {/* Upload Dialog */}
            <Dialog
                open={uploadDialogOpen}
                onClose={closeUploadDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Upload Photo</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" alignItems="center" py={2}>
                        {imagePreview ? (
                            <Box sx={{ width: '100%', mb: 2 }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={imagePreview}
                                    alt="Preview"
                                    sx={{
                                        objectFit: 'contain',
                                        borderRadius: '4px',
                                        width: '100%',
                                        maxHeight: '200px'
                                    }}
                                />
                            </Box>
                        ) : (
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                border="1.5px dashed #ccc"
                                borderRadius="8px"
                                p={4}
                                mb={2}
                                width="100%"
                                sx={{ backgroundColor: 'grey.50' }}
                            >
                                <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                                <Typography variant="body2" color="textSecondary" textAlign="center">
                                    Select a high-quality image to upload
                                </Typography>
                            </Box>
                        )}

                        <UploadButton
                            component="label"
                            startIcon={<CloudUploadIcon />}
                        >
                            {imagePreview ? 'Change Image' : 'Select Image'}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageSelect}
                            />
                        </UploadButton>

                        {selectedImage && (
                            <Box mt={1} textAlign="center">
                                <Typography variant="body2" color="text.secondary">
                                    Selected: {selectedImage.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Size: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                                </Typography>
                            </Box>
                        )}

                        <Typography variant="caption" color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
                            Supported formats: JPG, PNG, WebP. Maximum size: 10MB
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <SecondaryButton onClick={closeUploadDialog}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton
                        onClick={handleUpload}
                        disabled={!selectedImage || uploading}
                        startIcon={uploading ? <CircularProgress size={16} /> : null}
                    >
                        {uploading ? 'Uploading...' : 'Upload Photo'}
                    </PrimaryButton>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this photo? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <SecondaryButton onClick={closeDeleteDialog}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton
                        onClick={handleDelete}
                        disabled={deleting}
                        startIcon={deleting ? <CircularProgress size={16} /> : <DeleteIcon />}
                    >
                        {deleting ? 'Deleting...' : 'Delete Photo'}
                    </PrimaryButton>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default PhotosScreen;