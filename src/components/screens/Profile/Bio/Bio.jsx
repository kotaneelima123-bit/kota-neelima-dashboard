import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Card,
    CardMedia,
    IconButton,
    CircularProgress,
    Alert,
    Divider,
    Fade,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getBioItem, createBioItem, updateBioItem, deleteBioItem } from '../../../../api/profileService';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    marginTop: theme.spacing(4),
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
}));

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

const BioScreen = () => {
    const [bioData, setBioData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        descriptionHindi: '',
        descriptionTelugu: '',
        profileImage: null
    });

    // Fetch bio data on component mount
    useEffect(() => {
        fetchBioData();
    }, []);

    const fetchBioData = async () => {
        try {
            setLoading(true);
            const response = await getBioItem();
            if (response.data) {
                const bio = response.data;
                setBioData(bio);
                setFormData({
                    description: bio.description || '',
                    descriptionHindi: bio.descriptionHindi || '',
                    descriptionTelugu: bio.descriptionTelugu || '',
                    profileImage: null
                });
                if (bio.profileImage) {
                    setImagePreview(bio.profileImage);
                }
            } else {
                setBioData(null);
            }
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch bio data');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                profileImage: file
            }));
            setSelectedImage(file.name);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError('');

            if (bioData) {
                // Update existing bio
                await updateBioItem(bioData._id, formData);
                setSuccess('Bio updated successfully!');
            } else {
                // Create new bio
                await createBioItem(formData);
                setSuccess('Bio created successfully!');
            }

            setEditMode(false);
            fetchBioData(); // Refresh data
        } catch (error) {
            setError('Failed to save bio. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await deleteBioItem(bioData._id);
            setSuccess('Bio deleted successfully!');
            setBioData(null);
            setFormData({
                description: '',
                descriptionHindi: '',
                descriptionTelugu: '',
                profileImage: null
            });
            setImagePreview('');
            setDeleteDialogOpen(false);
        } catch (error) {
            setError('Failed to delete bio. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    const toggleEditMode = () => {
        if (editMode) {
            // Reset form data when canceling edit
            setFormData({
                description: bioData?.description || '',
                descriptionHindi: bioData?.descriptionHindi || '',
                descriptionTelugu: bioData?.descriptionTelugu || '',
                profileImage: null
            });
            setSelectedImage(null);
            if (bioData?.profileImage) {
                setImagePreview(bioData.profileImage);
            }
        }
        setEditMode(!editMode);
    };

    const openDeleteDialog = () => {
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                    fontWeight: 600,
                    color: '#75030F',
                    textAlign: 'center',
                    mb: 4
                }}
            >
                Manage Bio
            </Typography>

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
                <Fade in={!loading} timeout={500}>
                    <Box>
                        {bioData && !editMode && (
                            <Box display="flex" justifyContent="flex-end" mb={2}>
                                <SecondaryButton
                                    startIcon={<DeleteIcon />}
                                    onClick={openDeleteDialog}
                                    sx={{ mr: 2 }}
                                >
                                    Delete Bio
                                </SecondaryButton>
                                <PrimaryButton
                                    startIcon={<EditIcon />}
                                    onClick={toggleEditMode}
                                >
                                    Edit Bio
                                </PrimaryButton>
                            </Box>
                        )}

                        <StyledPaper elevation={0}>
                            {editMode ? (
                                // Edit Mode
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={4}>
                                        <Grid item xs={12} md={4}>
                                            <Box display="flex" flexDirection="column" alignItems="center">
                                                <Card sx={{ width: '100%', maxWidth: 300, boxShadow: 2, mb: 2 }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="280"
                                                        image={imagePreview || '/placeholder-avatar.png'}
                                                        alt="Profile"
                                                        sx={{ objectFit: 'cover' }}
                                                    />
                                                </Card>
                                                <UploadButton
                                                    component="label"
                                                    startIcon={<CloudUploadIcon />}
                                                    fullWidth
                                                >
                                                    Change Image
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                </UploadButton>
                                                {selectedImage && (
                                                    <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
                                                        Selected: {selectedImage}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: 'text.primary', mb: 1 }}>
                                                Bio in English
                                            </Typography>
                                            <TextField
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                fullWidth
                                                multiline
                                                rows={4}
                                                required
                                                sx={{ mb: 2, width: '80vw', maxWidth: 900 }}
                                            />

                                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: 'text.primary', mb: 1 }}>
                                                Bio in Hindi
                                            </Typography>
                                            <TextField
                                                name="descriptionHindi"
                                                value={formData.descriptionHindi}
                                                onChange={handleInputChange}
                                                fullWidth
                                                multiline
                                                rows={4}
                                                sx={{ mb: 2, width: '80vw', maxWidth: 900 }}
                                            />

                                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: 'text.primary', mb: 1 }}>
                                                Bio in Telugu
                                            </Typography>
                                            <TextField
                                                name="descriptionTelugu"
                                                value={formData.descriptionTelugu}
                                                onChange={handleInputChange}
                                                fullWidth
                                                multiline
                                                rows={4}
                                                sx={{ mb: 2, width: '80vw', maxWidth: 900 }}
                                            />

                                            <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
                                                <SecondaryButton onClick={toggleEditMode}>
                                                    Cancel
                                                </SecondaryButton>
                                                <PrimaryButton
                                                    type="submit"
                                                    disabled={saving}
                                                >
                                                    {saving ? <CircularProgress size={20} /> : 'Save Changes'}
                                                </PrimaryButton>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </form>
                            ) : bioData ? (
                                // View Mode when bio exists
                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={4}>
                                        <Card sx={{ width: '100%', maxWidth: 300, mx: 'auto', boxShadow: 2 }}>
                                            <CardMedia
                                                component="img"
                                                height="300"
                                                image={imagePreview || '/placeholder-avatar.png'}
                                                alt="Profile"
                                                sx={{ objectFit: 'cover' }}
                                            />
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={8}>
                                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: 'text.primary' }}>
                                            Bio in English
                                        </Typography>
                                        <Typography variant="body1" paragraph sx={{ width: '80vw', maxWidth: 900, lineHeight: 1.7, color: 'text.secondary', mb: 3 }}>
                                            {bioData.description || 'No bio description available.'}
                                        </Typography>

                                        <Divider sx={{ my: 3 }} />

                                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: 'text.primary' }}>
                                            Bio in Hindi
                                        </Typography>
                                        <Typography variant="body1" paragraph sx={{ width: '80vw', maxWidth: 900, lineHeight: 1.7, color: 'text.secondary', mb: 3 }}>
                                            {bioData.descriptionHindi || 'No Hindi bio description available.'}
                                        </Typography>

                                        <Divider sx={{ my: 3 }} />

                                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: 'text.primary' }}>
                                            Bio in Telugu
                                        </Typography>
                                        <Typography variant="body1" paragraph sx={{ width: '80vw', maxWidth: 900, lineHeight: 1.7, color: 'text.secondary' }}>
                                            {bioData.descriptionTelugu || 'No Telugu bio description available.'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            ) : (
                                // No bio exists - Create mode
                                <Box textAlign="center" py={4}>
                                    <Typography variant="h6" color="textSecondary" gutterBottom>
                                        No bio has been created yet
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
                                        Create a bio to showcase your information on the website
                                    </Typography>
                                    <PrimaryButton
                                        startIcon={<EditIcon />}
                                        onClick={toggleEditMode}
                                    >
                                        Create Bio
                                    </PrimaryButton>
                                </Box>
                            )}
                        </StyledPaper>
                    </Box>
                </Fade>
            )}

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
                        Are you sure you want to delete your bio? This action cannot be undone and your bio will no longer be visible on the website.
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
                        {deleting ? 'Deleting...' : 'Delete Bio'}
                    </PrimaryButton>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default BioScreen;